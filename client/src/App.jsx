import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SessionManager from "./components/SessionManager";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import { Welcome } from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
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
import AdminLayout from "./components/AdminLayout";
import ForgotPassword from "./pages/user/ForgotPassword";
import ResetPassword from "./pages/user/ResetPassword";
import ComparePanel from "./components/compare/ComparePanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useTheme } from "./components/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { setCompareList } from "./redux/slices/compareSlice";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  // Hydrate compare list only for guests
  useEffect(() => {
    const storedCompare = localStorage.getItem("compareItems");
    const token = localStorage.getItem("token");

    if (storedCompare && !token) {
      dispatch(setCompareList(JSON.parse(storedCompare)));
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
    <>
      <BrowserRouter>
        <SessionManager />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Welcome />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:email" element={<ResetPassword />} />
            <Route path="products" element={<UserProductList />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="compare" element={<ComparePage />} />

            <Route element={<PrivateRoute />}>
              <Route path="profile" element={<Profile />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="payment" element={<Payment />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              <Route path="payment-cancel" element={<PaymentCancel />} />
            </Route>
          </Route>

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

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme={theme}
        />
      </BrowserRouter>
    </>
  );
}

export default App;
