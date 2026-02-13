import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FiX, FiMenu } from 'react-icons/fi';

function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    try {
      dispatch(logout());
      toast.success('Logged out successfully', { className: 'toastSuccess' });
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed. Please try again.');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Hamburger / Close button (mobile only) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          className="p-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-[var(--color-charcoal-800)] rounded shadow"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Overlay (tap anywhere to close) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with slide-in animation */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out 
        md:relative md:translate-x-0 md:w-64 bg-white dark:bg-[var(--color-charcoal-900)] shadow-md z-40`}
      >
        <AdminSidebar 
          onLogout={handleLogout} 
          onLinkClick={() => setSidebarOpen(false)}  
        />
      </div>

      {/* Main content */}
      <main
        className="flex-1 p-6 bg-gray-50 dark:bg-[var(--color-charcoal-900)] transition-colors"
        aria-label="Admin main content"
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;