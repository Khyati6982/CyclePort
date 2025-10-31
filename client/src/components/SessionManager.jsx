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
          toast.error("Session expired. Please log in again.");
          setTimeout(() => {
            dispatch(logout());
            navigate("/login");
          }, 1500);
        });
    }
  }, [dispatch, user, navigate]);

  return null;
};

export default SessionManager;
