const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  cruise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cruise',
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  numberOfPassengers: {
    type: Number,
    required: true,
    min: 1
  },
  passengers: [{
    name: {
      type: String,
      required: true
    },
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  cancellationReason: String,
  cancellationDate: Date,
  refundStatus: {
    type: String,
    enum: ['not_applicable', 'pending', 'processed', 'failed'],
    default: 'not_applicable'
  },
  refundDetails: {
    amount: Number,
    processedAt: Date,
    transactionId: String
  },
  notificationsSent: {
    bookingConfirmation: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    },
    paymentConfirmation: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    },
    cancellation: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for common queries
bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ cruise: 1, bookingDate: 1 });
bookingSchema.index({ 'paymentDetails.razorpayOrderId': 1 });
bookingSchema.index({ status: 1 });

// Calculate total amount before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('numberOfPassengers')) {
    try {
      const cruise = await mongoose.model('Cruise').findById(this.cruise);
      if (cruise) {
        this.totalAmount = cruise.pricePerPerson * this.numberOfPassengers;
      }
    } catch (error) {
      next(error);
    }
  }
  next();
});

// Update cruise booking count after successful payment
bookingSchema.methods.confirmBooking = async function() {
  try {
    const cruise = await mongoose.model('Cruise').findById(this.cruise);
    if (cruise) {
      cruise.updateBookingCount(this.bookingDate, this.numberOfPassengers);
      await cruise.save();
    }
  } catch (error) {
    console.error('Error updating cruise booking count:', error);
    throw error;
  }
};

// Method to handle booking cancellation
bookingSchema.methods.cancelBooking = async function(reason) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancellationDate = new Date();
  
  if (this.paymentStatus === 'completed') {
    this.refundStatus = 'pending';
  }
  
  await this.save();
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
