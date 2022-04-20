const mongoose = require('mongoose');

// create a new schema
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    review: { type: String, required: [true, 'Review cannot be empty'] },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Rewiew must belong to a user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Rewiew must belong to a tour'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Rewiew;
