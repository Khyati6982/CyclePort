import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/Order.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const customOrderId = paymentIntent.metadata?.orderId;

    if (customOrderId) {
      try {
        const order = await Order.findOne({ customOrderId });
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.status = 'paid';
          await order.save();
        }
      } catch (err) {
        console.error("Webhook order lookup failed:", err.message);
      }
    }
  }

  res.status(200).json({ received: true });
};