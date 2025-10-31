import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customOrderId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    },
  ],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    default: 'COD',
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  shippingInfo: {
    address: String,
    city: String,
    postalCode: String,
    phone: String,
  },
  billingDetails: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    address: {
      line1: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;