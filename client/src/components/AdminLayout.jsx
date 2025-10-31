import AdminSidebar from './AdminSidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { toast } from 'react-toastify'

function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully', { className: 'toastSuccess' })
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-[var(--color-charcoal-900)]">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout