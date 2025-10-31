import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Helper function to decrement stocks after creating the order
const decrementStock = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item._id);
    if (product) {
      product.countInStock = Math.max(0, product.countInStock - item.quantity);
      await product.save();
    }
  }
};

// Create new order (manual or Stripe-based)
export const createOrder = async (req, res) => {
  try {
    const { items, total, status, paymentMethod, shippingInfo, billingDetails } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must include at least one item.' });
    }

    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ message: 'Total must be a positive number.' });
    }

    const allowedStatuses = ['pending', 'paid', 'shipped', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status.' });
    }

    const order = new Order({
      customOrderId: `order-${Date.now()}`,
      userId: req.user._id,
      items,
      total,
      status: status || 'pending',
      paymentMethod: paymentMethod || 'COD',
      shippingInfo,
      billingDetails,
      isPaid: status === 'paid',
      paidAt: status === 'paid' ? new Date() : null,
    });

    await order.save();
    await decrementStock(order.items);
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order.' });
  }
};

// Get orders for logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user orders.' });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all orders.' });
  }
};
