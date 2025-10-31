import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, orderId, billingDetails } = req.body;

    // Create Stripe customer
    const customer = await stripe.customers.create({
      name: billingDetails.name,
      email: billingDetails.email,
      phone: billingDetails.phone,
      address: {
        line1: billingDetails.address.line1,
        city: billingDetails.address.city,
        postal_code: billingDetails.address.postalCode,
        country: billingDetails.address.country || 'IN',
      },
    });

    // Create payment intent linked to customer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert ₹ to paise
      currency: 'inr',
      customer: customer.id,
      description: `CyclePort Order - ${orderId}`, // Required for export
      metadata: { orderId },
      shipping: {
        name: billingDetails.name,
        phone: billingDetails.phone,
        address: {
          line1: billingDetails.address.line1,
          city: billingDetails.address.city,
          postal_code: billingDetails.address.postalCode,
          country: billingDetails.address.country || 'IN',
        },
      },
      receipt_email: billingDetails.email,
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};