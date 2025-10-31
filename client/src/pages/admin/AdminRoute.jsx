import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'

const AdminRoute = () => {
  const user = useSelector((state) => state.auth.user)

  if (!user || user.role !== 'admin') {
    toast.warn('Admin access required.')
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default AdminRoute
