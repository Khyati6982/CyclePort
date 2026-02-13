import { Navigate, Outlet } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

const AdminRoute = () => {
  const user = useSelector((state) => state.auth.user, shallowEqual);

  // Guard: ensure user exists and has admin role
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />; // redirect non-admins to home
  }

  return <Outlet />;
};

export default AdminRoute;