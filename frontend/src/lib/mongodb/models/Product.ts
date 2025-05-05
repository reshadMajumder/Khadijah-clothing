import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  short_description: { type: String, required: true },
  image: { type: String, required: true },
  sizes: [{ type: String }],
  price: { type: Number, required: true },
  available_stock: { type: Number, required: true },
  category: { type: String, required: true }
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);