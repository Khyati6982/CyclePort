import { Navigate, Outlet } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

const PrivateRoute = () => {
  const { user, token, isLoading } = useSelector(
    (state) => state.auth,
    shallowEqual
  );

  // Show loader while auth state is being resolved
  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const isAuthenticated = Boolean(user && token);

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;