import mongoose from 'mongoose';
import Product from './Product.js';

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
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
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
    enum: ['pending', 'paid', 'shipped', 'cancelled', 'failed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Stripe', 'Stripe PaymentIntent', 'Stripe Checkout'],
    default: 'Stripe',
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
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

/**
 * Middleware: After an order is deleted, restore stock automatically
 */
orderSchema.post('findOneAndDelete', async function (doc) {
  if (doc && doc.items && doc.items.length > 0) {
    for (const item of doc.items) {
      try {
        const product = await Product.findById(item.productId);
        if (product) {
          product.countInStock += item.quantity;
          await product.save();
        }
      } catch (err) {
        console.error("❌ Error restoring stock:", err.message);
      }
    }
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;