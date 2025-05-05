import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone_number: { type: String, required: true },
  products: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    size: String,
    quantity: Number
  }],
  total_price_bdt: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);