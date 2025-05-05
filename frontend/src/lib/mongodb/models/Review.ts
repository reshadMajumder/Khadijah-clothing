import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  review_text: { type: String, required: true },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);