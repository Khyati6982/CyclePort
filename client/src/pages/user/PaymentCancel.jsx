import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { FiArrowLeftCircle, FiRefreshCw } from 'react-icons/fi';

const PaymentCancel = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-xl mx-auto mt-20 text-center space-y-6">
      <h2 className="text-3xl font-bold text-red-500">Payment Cancelled ❌</h2>
      <p className="text-lg text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
        Looks like the payment didn’t go through. You can retry or return to your cart to review your items.
      </p>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => navigate('/checkout')}
          className="btnPrimary flex items-center gap-2 cursor-pointer"
          aria-label="Retry payment"
        >
          <FiRefreshCw /> Retry Payment
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="btnSecondary flex items-center gap-2 cursor-pointer"
          aria-label="Go to cart"
        >
          <FiArrowLeftCircle /> Go to Cart
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;