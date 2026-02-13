import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminRoute = () => {
  const user = useSelector((state) => state.auth.user);

  // If no user or not admin, block access
  if (!user || user.role !== 'admin') {
    // Prevent duplicate toasts on re-renders
    toast.dismiss();
    toast.warn('Admin access required.', { className: 'toastWarn' });
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;