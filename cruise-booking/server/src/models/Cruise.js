const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required']
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  }
});

const availableDateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  }
});

const cruiseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cruise name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  startingDestination: destinationSchema,
  endingDestination: destinationSchema,
  amenities: [String],
  images: [String],
  availableDates: [availableDateSchema],
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

// Indexes for better query performance
cruiseSchema.index({ price: 1, rating: -1 });
cruiseSchema.index({ 'startingDestination.name': 1, 'endingDestination.name': 1 });

const Cruise = mongoose.model('Cruise', cruiseSchema);

module.exports = Cruise;
