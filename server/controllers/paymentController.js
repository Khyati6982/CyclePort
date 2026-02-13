import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Create Stripe payment intent
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, orderId, billingDetails } = req.body

    if (!amount || amount <= 0) {
      const error = new Error('Amount must be a positive number.')
      error.statusCode = 400
      throw error
    }

    if (!billingDetails || !billingDetails.email || !billingDetails.name) {
      const error = new Error('Billing details are required.')
      error.statusCode = 400
      throw error
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      name: billingDetails.name,
      email: billingDetails.email,
      phone: billingDetails.phone,
      address: {
        line1: billingDetails.address?.line1 || '',
        city: billingDetails.address?.city || '',
        postal_code: billingDetails.address?.postalCode || '',
        country: billingDetails.address?.country || 'IN',
      },
    })

    // Create payment intent linked to customer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert ₹ to paise
      currency: 'inr',
      customer: customer.id,
      description: `CyclePort Order - ${orderId}`,
      metadata: { orderId },
      shipping: {
        name: billingDetails.name,
        phone: billingDetails.phone,
        address: {
          line1: billingDetails.address?.line1 || '',
          city: billingDetails.address?.city || '',
          postal_code: billingDetails.address?.postalCode || '',
          country: billingDetails.address?.country || 'IN',
        },
      },
      receipt_email: billingDetails.email,
    })

    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    next(err)
  }
}