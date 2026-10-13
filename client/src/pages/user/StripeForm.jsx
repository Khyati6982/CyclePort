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
import axios from "../../utils/axios";

const StripeForm = ({ total, billingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items || []);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const validateStockBeforeOrder = async () => {
    try {
      for (const item of cart) {
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (!data) {
          toast.error(`Failed to validate stock for ${item.name}`);
          return false;
        }
        if (item.quantity > data.countInStock) {
          toast.error(
            `Only ${data.countInStock} units of ${item.name} are available.`,
          );
          return false;
        }
      }
      return true;
    } catch (err) {
      toast.error("Stock validation failed.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Submit elements before any async work
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message);
        setLoading(false);
        return;
      }

      // Validate stock
      const isStockValid = await validateStockBeforeOrder();
      if (!isStockValid) {
        setLoading(false);
        return;
      }

      // Create order in backend
      const { data } = await axios.post("/api/orders", {
        items: cart,
        total,
        status: "pending",
        paymentMethod: "Stripe",
        billingDetails,
        shippingInfo: {
          phone: billingDetails.phone,
          postalCode: billingDetails.address.postalCode,
          city: billingDetails.address.city,
          address: billingDetails.address.line1,
        },
      });

      const { customOrderId } = data;

      // Create PaymentIntent with metadata
      const { data: piData } = await axios.post(
        "/api/payment/create-payment-intent",
        {
          amount: total,
          orderId: customOrderId,
          billingDetails,
        },
      );

      const clientSecret = piData.clientSecret;

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message);
        navigate("/payment-cancel");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        dispatch(clearCart());
        toast.success("Payment successful. Order updated!");
        navigate("/payment-success");
      }
    } catch (err) {
      toast.error("Payment processing failed.");
    } finally {
      setLoading(false);
    }
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
        <FiCreditCard />{" "}
        {loading ? "Processing..." : `Pay ${formatCurrency(total)}`}
      </button>
    </form>
  );
};

export default StripeForm;
