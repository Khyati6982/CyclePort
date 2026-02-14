import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import SessionManager from "./components/SessionManager";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ComparePanel from "./components/compare/ComparePanel";
import { Welcome } from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/user/ProductDetails";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Payment from "./pages/user/Payment";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import PaymentCancel from "./pages/user/PaymentCancel";
import UserProductList from "./pages/user/UserProductList";
import ComparePage from "./pages/ComparePage";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import ProductList from "./pages/admin/ProductList";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

import { useTheme } from "./components/ThemeProvider";
import { setCompareList } from "./redux/slices/compareSlice";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  // Hydrate compare list only for guests
  useEffect(() => {
    try {
      const storedCompare = localStorage.getItem("compareItems");
      const token = localStorage.getItem("token");

      if (storedCompare && !token) {
        dispatch(setCompareList(JSON.parse(storedCompare)));
      }
    } catch {
      console.warn("Failed to hydrate compare list from localStorage.");
    }
  }, [dispatch]);

  // Auto-logout on tab close
  useEffect(() => {
    const handleUnload = () => {
      dispatch({ type: "auth/logout" });
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-sm">Validating session...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <SessionManager />
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:email" element={<ResetPassword />} />
          <Route path="products" element={<UserProductList />} />
          <Route path="products/:id/:slug?" element={<ProductDetails />} />
          <Route path="compare" element={<ComparePage />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment" element={<Payment />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="payment-cancel" element={<PaymentCancel />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/edit-product/:id" element={<EditProduct />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>

      <ComparePanel />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme={theme}
      />

      {/* Stripe Context (optional wrap for payment routes) */}
      <Elements stripe={stripePromise}>
        {/* Payment-related components can be wrapped here if needed */}
      </Elements>
    </BrowserRouter>
  );
}

export default App;