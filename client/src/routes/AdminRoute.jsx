import { Navigate, Outlet } from 'react-router-dom'
import { useSelector, shallowEqual } from 'react-redux'

const AdminRoute = () => {
  const user = useSelector((state) => state.auth.user, shallowEqual)

  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/login" />
}

export default AdminRoute