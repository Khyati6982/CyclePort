import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, logout } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SessionManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !user) {
      dispatch(fetchProfile())
        .unwrap()
        .catch((err) => {
          console.error("SessionManager error:", err?.message || err);
          toast.error("Session expired. Please log in again.", {
            className: "toastError",
          });

          // Clear session safely
          setTimeout(() => {
            dispatch(logout());
            localStorage.removeItem("token");
            navigate("/login");
          }, 1500);
        });
    }

    if (!token && user) {
      // If token is missing but user exists in state, force logout
      dispatch(logout());
      navigate("/login");
    }
  }, [dispatch, user, navigate]);

  return null;
};

export default SessionManager;