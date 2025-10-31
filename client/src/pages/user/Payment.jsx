import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeForm from './StripeForm';
import BillingForm from '../../components/BillingForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [billingDetails, setBillingDetails] = useState(null);
  const cart = useSelector((state) => state.cart.items);
  const { token } = useSelector((state) => state.auth); // Extract token

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleBillingSubmit = async (details) => {
    setBillingDetails(details);
    try {
      const { data } = await axios.post(
        '/api/payment/create-payment-intent',
        {
          amount: total,
          orderId: `order-${Date.now()}`,
          billingDetails: details,
        },
      );

      setClientSecret(data.clientSecret);
    } catch (err) {
      toast.error('Failed to initialize payment.');
    }
  };

  const appearance = { theme: 'stripe' };
  const options = { clientSecret, appearance };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-teal-500)]">Complete Your Payment</h2>

      {!clientSecret ? (
        <BillingForm onSubmit={handleBillingSubmit} />
      ) : (
        <Elements stripe={stripePromise} options={options}>
          <StripeForm total={total} billingDetails={billingDetails} />
        </Elements>
      )}
    </div>
  );
};

export default Payment;