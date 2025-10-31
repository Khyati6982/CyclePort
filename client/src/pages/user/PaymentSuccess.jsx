import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { FiHome, FiCheckCircle } from "react-icons/fi";

const PaymentSuccess = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-xl mx-auto mt-20 text-center space-y-6">
      <h2 className="text-3xl font-bold text-[var(--color-teal-500)] flex items-center justify-center gap-2">
        <FiCheckCircle className="text-[var(--color-teal-500)]" /> Payment Successful 🎉
      </h2>
      <p className="text-lg text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
        Thank you for your purchase! Your order has been confirmed.
      </p>
      <p className="text-sm text-[var(--color-charcoal-500)] dark:text-[var(--color-charcoal-300)]">
        You’ll receive a confirmation email shortly.
      </p>
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="btnPrimary mt-6 flex items-center justify-center gap-2 cursor-pointer"
          aria-label="Return to home"
        >
          <FiHome /> Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
