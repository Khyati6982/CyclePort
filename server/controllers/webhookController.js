import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import { decrementStock, restoreStock } from './orderController.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    console.log("⚡ Webhook received:", event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customOrderId = session.metadata?.orderId?.trim();
        console.log("🔎 checkout.session.completed for OrderId:", customOrderId);

        if (customOrderId) {
          const order = await Order.findOne({ customOrderId });
          if (order) {
            if (!order.isPaid) {
              await decrementStock(order.items);
            }

            order.isPaid = true;
            order.paidAt = order.paidAt || Date.now();
            order.status = 'paid';
            order.paymentMethod = 'Stripe Checkout';
            await order.save();
            console.log("✅ Order updated:", order._id);
          } else {
            console.warn("⚠️ No order found for OrderId:", customOrderId);
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const customOrderId = paymentIntent.metadata?.orderId?.trim();
        console.log("🔎 payment_intent.succeeded for OrderId:", customOrderId);
        console.log("📜 Metadata raw:", JSON.stringify(paymentIntent.metadata));

        if (customOrderId) {
          const order = await Order.findOne({ customOrderId });
          if (order) {
            if (!order.isPaid) {
              await decrementStock(order.items);
            }

            order.isPaid = true;
            order.paidAt = order.paidAt || Date.now();
            order.status = 'paid';
            order.paymentMethod = 'Stripe PaymentIntent';
            await order.save();
            console.log("✅ Order updated:", order._id);
          } else {
            console.warn("⚠️ No order found for OrderId:", customOrderId);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const customOrderId = paymentIntent.metadata?.orderId?.trim();
        console.log("🔎 payment_intent.payment_failed for OrderId:", customOrderId);

        if (customOrderId) {
          const order = await Order.findOne({ customOrderId });
          if (order) {
            if (order.status !== 'failed') {
              await restoreStock(order.items);
            }

            order.isPaid = false;
            order.status = 'failed';
            order.paidAt = order.paidAt || null;
            await order.save();
            console.log("❌ Order marked failed and stock restored:", order._id);
          } else {
            console.warn("⚠️ No order found for OrderId:", customOrderId);
          }
        }
        break;
      }

      default:
        console.log("ℹ️ Unhandled event type:", event.type);
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook processing error:", err.message);
    next(err);
  }
};