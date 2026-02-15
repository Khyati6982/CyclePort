import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Helper function to decrement stocks after creating the order
const decrementStock = async (items) => {
  for (const item of items) {
    try {
      const product = await Product.findById(item._id);
      if (product) {
        product.countInStock = Math.max(0, product.countInStock - item.quantity);
        await product.save();
      }
    } catch (err) {
      console.error("Stock decrement error for item:", item, err.message);
    }
  }
};

// Create new order (manual or Stripe-based)
export const createOrder = async (req, res, next) => {
  try {
    const { items, total, status, paymentMethod, shippingInfo, billingDetails, customOrderId } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: req.user missing" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must include at least one item." });
    }

    if (typeof total !== "number" || total <= 0) {
      return res.status(400).json({ message: "Total must be a positive number." });
    }

    const allowedStatuses = ["pending", "paid", "shipped", "cancelled"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const order = new Order({
      customOrderId,
      userId: req.user._id,
      items,
      total,
      status: status || "pending",
      paymentMethod: paymentMethod || "Stripe",
      shippingInfo,
      billingDetails,
      isPaid: status === "paid",
      paidAt: status === "paid" ? new Date() : null,
    });

    await order.save();
    await decrementStock(order.items);

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get orders for logged-in user
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};