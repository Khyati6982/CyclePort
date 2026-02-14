import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/Order.js';

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
    // Signature verification failed
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customOrderId = session.metadata?.orderId;

        if (customOrderId) {
          const order = await Order.findOne({ customOrderId });
          if (order && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.status = 'paid';
            order.paymentMethod = 'Stripe Checkout';
            await order.save();
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const customOrderId = paymentIntent.metadata?.orderId;

        if (customOrderId) {
          const order = await Order.findOne({ customOrderId });
          if (order && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.status = 'paid';
            order.paymentMethod = 'Stripe PaymentIntent';
            await order.save();
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const customOrderId = paymentIntent.metadata?.orderId;

        if (customOrderId) {
          const order = await Order.findOne({ customOrderId });
          if (order) {
            order.status = 'failed';
            await order.save();
          }
        }
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
};