import Stripe from 'stripe'
import dotenv from 'dotenv'
import Order from '../models/Order.js'

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,  
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    const error = new Error(`Webhook signature verification failed: ${err.message}`)
    error.statusCode = 400
    return next(error)
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      const customOrderId = paymentIntent.metadata?.orderId

      if (customOrderId) {
        const order = await Order.findOne({ customOrderId })
        if (order && !order.isPaid) {
          order.isPaid = true
          order.paidAt = Date.now()
          order.status = 'paid'
          order.paymentMethod = 'Stripe'
          await order.save()
        }
      }
    }

    res.status(200).json({ received: true })
  } catch (err) {
    next(err)
  }
}