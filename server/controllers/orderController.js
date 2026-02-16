import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Helper function to decrement stocks after creating the order
const decrementStock = async (items) => {
  for (const item of items) {
    try {
      const product = await Product.findById(item.productId || item._id);
      if (product) {
        product.countInStock = Math.max(0, product.countInStock - item.quantity);
        await product.save();
      }
    } catch (err) {
      console.error("Stock decrement error for item:", item, err.message);
    }
  }
};

// Helper function to restore stocks after deleting the order
const restoreStock = async (items) => {
  for (const item of items) {
    try {
      const product = await Product.findById(item.productId || item._id);
      if (product) {
        product.countInStock += item.quantity;
        await product.save();
      }
    } catch (err) {
      console.error("Stock restore error for item:", item, err.message);
    }
  }
};

// Create new order (manual or Stripe-based)
export const createOrder = async (req, res, next) => {
  try {
    const { items, total, status, paymentMethod, shippingInfo, billingDetails } = req.body;

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

    // Generate customOrderId here in backend
    const customOrderId = `order-${Date.now()}`;

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

    // Return customOrderId so frontend can use it in Stripe metadata
    res.status(201).json({ order, customOrderId });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Delete order and restore stock
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await restoreStock(order.items);
    await order.deleteOne();

    res.status(200).json({ message: "Order deleted and stock restored" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Manual restock (for Atlas deletions / future admin dashboard)
export const restockOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await restoreStock(order.items);

    res.status(200).json({ message: "Stock restored manually for order", orderId: order._id });
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