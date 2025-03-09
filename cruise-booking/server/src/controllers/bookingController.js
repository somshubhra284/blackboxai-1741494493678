const { catchAsync, APIError } = require('../middleware/errorHandler');
const Booking = require('../models/Booking');
const Cruise = require('../models/Cruise');
const razorpayInstance = require('../config/razorpay');
const { sendEmail } = require('../config/sendgrid');
const { sendSMS } = require('../config/twilio');

// Create booking and initiate payment
exports.createBooking = catchAsync(async (req, res) => {
  const {
    cruiseId,
    bookingDate,
    numberOfPassengers,
    passengers
  } = req.body;

  // Check if cruise exists and has availability
  const cruise = await Cruise.findById(cruiseId);
  if (!cruise) {
    throw new APIError('No cruise found with that ID', 404);
  }

  // Validate booking date and availability
  if (!cruise.checkAvailability(new Date(bookingDate), numberOfPassengers)) {
    throw new APIError('Selected date is not available or has insufficient capacity', 400);
  }

  // Calculate total amount
  const totalAmount = cruise.pricePerPerson * numberOfPassengers;

  // Create Razorpay order
  const razorpayOrder = await razorpayInstance.orders.create({
    amount: totalAmount * 100, // Amount in smallest currency unit (paise)
    currency: 'INR',
    receipt: `booking_${Date.now()}`
  });

  // Create booking
  const booking = await Booking.create({
    customer: req.customer._id,
    cruise: cruiseId,
    bookingDate: new Date(bookingDate),
    numberOfPassengers,
    passengers,
    totalAmount,
    paymentDetails: {
      razorpayOrderId: razorpayOrder.id
    }
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      }
    }
  });
});

// Verify and complete payment
exports.verifyPayment = catchAsync(async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  } = req.body;

  // Verify payment signature
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex');

  if (generated_signature !== razorpaySignature) {
    throw new APIError('Invalid payment signature', 400);
  }

  // Update booking
  const booking = await Booking.findOne({
    'paymentDetails.razorpayOrderId': razorpayOrderId
  });

  if (!booking) {
    throw new APIError('Booking not found', 404);
  }

  booking.paymentStatus = 'completed';
  booking.paymentDetails.razorpayPaymentId = razorpayPaymentId;
  booking.paymentDetails.razorpaySignature = razorpaySignature;
  booking.paymentDetails.paidAt = new Date();

  await booking.save();

  // Update cruise booking count
  await booking.confirmBooking();

  // Send confirmation notifications
  await sendBookingConfirmation(booking);

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// Send booking confirmation
const sendBookingConfirmation = async (booking) => {
  try {
    // Populate cruise details
    await booking.populate('cruise');
    await booking.populate('customer');

    // Send email confirmation
    const emailSubject = 'Cruise Booking Confirmation';
    const emailHtml = `
      <h1>Booking Confirmation</h1>
      <p>Dear ${booking.customer.name},</p>
      <p>Your booking for ${booking.cruise.name} has been confirmed!</p>
      <p>Booking Details:</p>
      <ul>
        <li>Booking ID: ${booking._id}</li>
        <li>Date: ${new Date(booking.bookingDate).toLocaleDateString()}</li>
        <li>Number of Passengers: ${booking.numberOfPassengers}</li>
        <li>Total Amount: ₹${booking.totalAmount}</li>
      </ul>
      <p>Thank you for choosing our service!</p>
    `;

    await sendEmail(booking.customer.email, emailSubject, emailHtml);

    // Send SMS confirmation
    const smsMessage = `Your cruise booking (ID: ${booking._id}) is confirmed for ${new Date(booking.bookingDate).toLocaleDateString()}. Total amount paid: ₹${booking.totalAmount}`;
    
    await sendSMS(booking.customer.phoneNumber, smsMessage);

    // Update notification status
    booking.notificationsSent.bookingConfirmation = {
      email: true,
      sms: true
    };
    await booking.save();

  } catch (error) {
    console.error('Error sending confirmation:', error);
    // Don't throw error as booking is already confirmed
  }
};

// Get customer's bookings
exports.getMyBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ customer: req.customer._id })
    .populate('cruise')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

// Get single booking
exports.getBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('cruise')
    .populate('customer');

  if (!booking) {
    throw new APIError('No booking found with that ID', 404);
  }

  // Check if the booking belongs to the logged-in customer
  if (booking.customer._id.toString() !== req.customer._id.toString()) {
    throw new APIError('You are not authorized to view this booking', 403);
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// Cancel booking
exports.cancelBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new APIError('No booking found with that ID', 404);
  }

  // Check if the booking belongs to the logged-in customer
  if (booking.customer.toString() !== req.customer._id.toString()) {
    throw new APIError('You are not authorized to cancel this booking', 403);
  }

  // Check if booking can be cancelled (e.g., not too close to cruise date)
  const bookingDate = new Date(booking.bookingDate);
  const today = new Date();
  const daysUntilCruise = Math.ceil((bookingDate - today) / (1000 * 60 * 60 * 24));

  if (daysUntilCruise < 2) {
    throw new APIError('Bookings cannot be cancelled within 48 hours of cruise date', 400);
  }

  await booking.cancelBooking(req.body.reason);

  // Send cancellation notifications
  const emailSubject = 'Booking Cancellation Confirmation';
  const emailHtml = `
    <h1>Booking Cancellation</h1>
    <p>Dear ${req.customer.name},</p>
    <p>Your booking (ID: ${booking._id}) has been cancelled.</p>
    <p>If you paid for this booking, a refund will be processed within 5-7 business days.</p>
  `;

  await sendEmail(req.customer.email, emailSubject, emailHtml);

  const smsMessage = `Your booking (ID: ${booking._id}) has been cancelled. Refund will be processed if applicable.`;
  await sendSMS(req.customer.phoneNumber, smsMessage);

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// Get booking statistics (Admin only)
exports.getBookingStats = catchAsync(async (req, res) => {
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$bookingDate' } },
        numBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        avgPassengers: { $avg: '$numberOfPassengers' }
      }
    },
    { $sort: { _id: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
