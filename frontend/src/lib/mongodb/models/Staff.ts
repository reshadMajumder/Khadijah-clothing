import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

export const Staff = mongoose.models.Staff || mongoose.model('Staff', staffSchema);