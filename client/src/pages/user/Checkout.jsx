import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiCreditCard } from "react-icons/fi";

const Checkout = () => {
  const cart = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handlePayment = () => {
    toast.success("Redirecting to payment...");
    navigate("/payment");
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-[var(--color-charcoal-700)]">
          Your cart is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-teal-500)]">
        Checkout
      </h2>

      {cart.map((item) => (
        <div
          key={item._id}
          className="border rounded p-4 flex justify-between bg-[var(--color-white)] dark:bg-[var(--color-charcoal-900)] transition-transform hover:scale-[1.01]"
          aria-label={`Checkout item: ${item.name}`}
        >
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-[var(--color-charcoal-700)]">
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </p>
            <p className="mt-1">
              ₹{item.price} × {item.quantity}
            </p>
          </div>
          <div className="font-bold">₹{item.price * item.quantity}</div>
        </div>
      ))}

      <div className="text-right font-bold text-lg">Total: ₹{getTotal()}</div>

      <div className="flex flex-col md:flex-row gap-4 mt-20 justify-center">
        <button
          onClick={() => navigate("/cart")}
          className="btnSecondary w-full md:w-auto px-4 py-2 border border-teal-500 text-teal-500 rounded hover:bg-teal-50 dark:hover:bg-[var(--color-charcoal-800)] transition cursor-pointer"
          aria-label="Back to cart"
        >
          ← Back to Cart
        </button>

        <button
          onClick={handlePayment}
          className="btnPrimary w-full md:w-auto flex items-center justify-center gap-2 cursor-pointer"
          aria-label="Proceed to payment"
        >
          <FiCreditCard /> Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;