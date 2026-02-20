import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from './ThemeProvider';
import { toast } from 'react-toastify';

function AdminSidebar({ onLogout, onLinkClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    try {
      dispatch(logout());
      toast.success('Admin logged out successfully.', { className: 'toastSuccess' });
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <aside
      className="w-64 h-full flex flex-col p-4 bg-white dark:bg-[var(--color-charcoal-900)] shadow-md overflow-y-auto transition-colors"
      aria-label="Admin sidebar navigation"
    >
      {/* Top Section: Identity + Links */}
      <div>
        {/* Admin Identity Block */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={user?.avatar || '/images/admin-avatar.jpg'}
            alt={`${user?.name || 'Admin'} Avatar`}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Logged in as</p>
            <h3 className="text-base font-semibold text-[var(--color-teal-500)]">
              {user?.name || 'Admin'}
            </h3>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 text-[var(--color-teal-600)]">Admin Panel</h2>
        <ul className="space-y-4">
          {[
            { to: '/admin/dashboard', label: 'Dashboard' },
            { to: '/admin/products', label: 'Manage Products' },
            { to: '/admin/add-product', label: 'Add Product' },
            { to: '/admin/orders', label: 'Orders' },
            { to: '/admin/users', label: 'Users' },
          ].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => (isActive ? 'adminLink active' : 'adminLink')}
                aria-label={`Navigate to ${link.label}`}
                onClick={onLinkClick}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section: Theme + Logout */}
      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:underline cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />} Toggle Theme
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-500 hover:underline cursor-pointer"
          aria-label="Logout from admin panel"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;