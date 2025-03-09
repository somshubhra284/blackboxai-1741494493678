const { catchAsync, APIError } = require('../middleware/errorHandler');
const Cruise = require('../models/Cruise');

// Helper class for API features
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

// Get all cruises with filtering
exports.getCruises = catchAsync(async (req, res) => {
  // Create feature instance
  const features = new APIFeatures(Cruise.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute query
  const cruises = await features.query;

  // Get total count for pagination
  const total = await Cruise.countDocuments(features.query._conditions);

  res.status(200).json({
    status: 'success',
    results: cruises.length,
    total,
    data: {
      cruises
    }
  });
});

// Get single cruise
exports.getCruise = catchAsync(async (req, res) => {
  const cruise = await Cruise.findById(req.params.id);

  if (!cruise) {
    throw new APIError('No cruise found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      cruise
    }
  });
});

// Create new cruise (Admin only)
exports.createCruise = catchAsync(async (req, res) => {
  const cruise = await Cruise.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      cruise
    }
  });
});

// Update cruise (Admin only)
exports.updateCruise = catchAsync(async (req, res) => {
  const cruise = await Cruise.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!cruise) {
    throw new APIError('No cruise found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      cruise
    }
  });
});

// Delete cruise (Admin only)
exports.deleteCruise = catchAsync(async (req, res) => {
  const cruise = await Cruise.findByIdAndDelete(req.params.id);

  if (!cruise) {
    throw new APIError('No cruise found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Search cruises by destination
exports.searchByDestination = catchAsync(async (req, res) => {
  const { destination } = req.query;
  
  const cruises = await Cruise.find({
    $or: [
      { 'startingDestination.name': { $regex: destination, $options: 'i' } },
      { 'endingDestination.name': { $regex: destination, $options: 'i' } }
    ]
  });

  res.status(200).json({
    status: 'success',
    results: cruises.length,
    data: {
      cruises
    }
  });
});

// Get available dates for a cruise
exports.getAvailableDates = catchAsync(async (req, res) => {
  const cruise = await Cruise.findById(req.params.id);

  if (!cruise) {
    throw new APIError('No cruise found with that ID', 404);
  }

  const availableDates = cruise.availableDates.filter(date => 
    date.capacity > date.bookedSeats && date.date > new Date()
  );

  res.status(200).json({
    status: 'success',
    data: {
      availableDates
    }
  });
});

// Add review to cruise
exports.addReview = catchAsync(async (req, res) => {
  const { rating, comment } = req.body;
  
  const cruise = await Cruise.findById(req.params.id);
  
  if (!cruise) {
    throw new APIError('No cruise found with that ID', 404);
  }

  cruise.reviews.push({
    customer: req.customer._id,
    rating,
    comment
  });

  await cruise.save();

  res.status(201).json({
    status: 'success',
    data: {
      review: cruise.reviews[cruise.reviews.length - 1]
    }
  });
});

// Get cruise reviews
exports.getCruiseReviews = catchAsync(async (req, res) => {
  const cruise = await Cruise.findById(req.params.id)
    .select('reviews')
    .populate({
      path: 'reviews.customer',
      select: 'name'
    });

  if (!cruise) {
    throw new APIError('No cruise found with that ID', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      reviews: cruise.reviews
    }
  });
});
