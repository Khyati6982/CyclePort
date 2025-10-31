import { Navigate, Outlet } from 'react-router-dom'
import { useSelector, shallowEqual } from 'react-redux'

const PrivateRoute = () => {
  const { user, token, isLoading } = useSelector((state) => state.auth, shallowEqual)

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>
  }

  const isAuthenticated = user && token

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute