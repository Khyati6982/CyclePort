import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "../../utils/axios";
import { setProducts } from "../../redux/slices/productSlice";
import { updateQuantity, removeFromCart, setCart } from "../../redux/slices/cartSlice";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

const Cart = () => {
  const products = useSelector((state) => state.products.products);
  const cart = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const refreshProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        dispatch(setProducts(data));
      } catch {}
    };

    refreshProducts();
  }, [dispatch]);

  const syncCartWithLiveStock = async () => {
    try {
      const { data: products } = await axios.get("/api/products");

      const updatedCart = cart.map((item) => {
        const liveProduct = products.find((p) => p._id === item._id);
        return liveProduct
          ? { ...item, countInStock: liveProduct.countInStock }
          : item;
      });

      dispatch(setCart(updatedCart));
    } catch {}
  };

  useEffect(() => {
    const interval = setInterval(syncCartWithLiveStock, 7000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleQuantityChange = (id, delta) => {
    const item = cart.find((i) => i._id === id);
    const product = products.find((p) => p._id === id);
    if (!item || !product) return;

    const newQuantity = item.quantity + delta;

    if (newQuantity > product.countInStock) {
      toast.error(
        `Only ${product.countInStock} units of ${item.name} are available.`
      );
      return;
    }

    if (newQuantity < 1) {
      toast.info(`Minimum quantity is 1.`);
      return;
    }

    dispatch(updateQuantity({ id, delta }));
  };

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.info(`${name} removed from cart.`);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.info("Please log in to proceed to checkout.");
      navigate("/login");
      return;
    }

    toast.success("Proceeding to checkout...");
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-10 space-y-3">
        <p className="text-lg font-semibold text-[var(--color-charcoal-700)] dark:text-[var(--color-charcoal-100)]">
          Your cart is feeling a little lonely...
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Browse our cycles and find your next ride!
        </p>
        <button
          onClick={() => navigate("/products")}
          className="btnPrimary mt-2 cursor-pointer"
        >
          Explore Cycles
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-teal-500)]">
        Your Cart
      </h2>

      {cart.map((item) => (
        <div
          key={item._id}
          className="border rounded p-4 flex items-center justify-between bg-[var(--color-white)] dark:bg-[var(--color-charcoal-900)] transition-transform hover:scale-[1.01]"
          aria-label={`Cart item: ${item.name}`}
        >
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-[var(--color-charcoal-700)]">
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </p>
            <p className="mt-1">
              ₹{item.price} × {item.quantity}
            </p>
            {(() => {
              if (item.countInStock === 0) {
                return (
                  <p className="text-sm text-red-500 font-semibold">
                    Out of Stock
                  </p>
                );
              } else if (item.countInStock === 1) {
                return (
                  <p className="text-sm text-red-500 font-semibold">
                    Only 1 left — last piece!
                  </p>
                );
              } else if (item.countInStock === 2) {
                return (
                  <p className="text-sm text-orange-500 font-semibold">
                    Only 2 left — selling fast!
                  </p>
                );
              } else if (item.countInStock === 3) {
                return (
                  <p className="text-sm text-yellow-600 font-semibold">
                    Only 3 left — order soon!
                  </p>
                );
              } else {
                return (
                  <p className="text-sm text-gray-500">
                    Available: {item.countInStock} in stock
                  </p>
                );
              }
            })()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(item._id, -1)}
              className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 transition-colors cursor-pointer"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <FiMinus />
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item._id, 1)}
              className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 transition-colors cursor-pointer"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <FiPlus />
            </button>
            <button
              onClick={() => handleRemove(item._id, item.name)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors flex items-center gap-1 cursor-pointer"
              aria-label={`Remove ${item.name} from cart`}
            >
              <FiTrash2 /> Remove
            </button>
          </div>
        </div>
      ))}

      <div className="text-right font-bold text-lg">Total: ₹{getTotal()}</div>

      <button
        onClick={handleCheckout}
        className="btnPrimary w-full cursor-pointer"
      >
        Checkout
      </button>
    </div>
  );
};

export default Cart;