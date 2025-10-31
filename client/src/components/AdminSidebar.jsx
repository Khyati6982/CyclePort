import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from './ThemeProvider'
import { toast } from 'react-toastify'

function AdminSidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Admin logged out successfully.', { className: 'toastSuccess' })
    navigate('/login')
  }

  return (
   <aside className="adminSidebar w-full md:w-64 flex-shrink-0 flex flex-col justify-between p-4 bg-white dark:bg-[var(--color-charcoal-900)] shadow-md rounded max-h-screen overflow-y-auto">
      <div>
        {/* Admin Identity Block */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={user?.avatar || '/images/admin-avatar.jpg'}
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Logged in as</p>
            <h3 className="text-base font-semibold text-[var(--color-teal-500)]">{user?.name || 'Admin'}</h3>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 text-[var(--color-teal-600)]">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? 'adminLink active' : 'adminLink'
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                isActive ? 'adminLink active' : 'adminLink'
              }
            >
              Manage Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/add-product"
              className={({ isActive }) =>
                isActive ? 'adminLink active' : 'adminLink'
              }
            >
              Add Product
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                isActive ? 'adminLink active' : 'adminLink'
              }
            >
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? 'adminLink active' : 'adminLink'
              }
            >
              Users
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="space-y-4 mt-10">
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
  )
}

export default AdminSidebar