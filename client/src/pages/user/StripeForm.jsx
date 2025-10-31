import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCreditCard } from "react-icons/fi";
import { clearCart } from "../../redux/slices/cartSlice";
import { createOrder } from "../../redux/slices/orderSlice";

const StripeForm = ({ total, billingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const validateStockBeforeOrder = async () => {
    for (const item of cart) {
      const res = await fetch(`/api/products/${item._id}`);
      const data = await res.json();

      if (!res.ok || !data) {
        toast.error(`Failed to validate stock for ${item.name}`);
        return false;
      }

      if (item.quantity > data.countInStock) {
        toast.error(
          `Only ${data.countInStock} units of ${item.name} are available.`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
      navigate("/payment-cancel");
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      try {
        const isStockValid = await validateStockBeforeOrder();
        if (!isStockValid) {
          setLoading(false);
          return;
        }

        const orderData = {
          userId: user._id,
          items: cart,
          total,
          status: "paid",
          billingDetails,
        };

        await dispatch(createOrder(orderData));
        dispatch(clearCart());
        toast.success("Payment successful. Order created!");
        navigate("/payment-success");
      } catch (err) {
        toast.error("Order creation failed.");
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Stripe Payment Form">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btnPrimary w-full mt-6 flex items-center justify-center gap-2 cursor-pointer"
        aria-label="Submit payment"
      >
        <FiCreditCard /> {loading ? "Processing..." : `Pay ₹${total}`}
      </button>
    </form>
  );
};

export default StripeForm;
