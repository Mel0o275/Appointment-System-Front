import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Spinner from './Spinner.jsx'
import Container from './Container.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ allowedRoles }) {
  const { loading, isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Container className="py-10">
        <Spinner label="Checking session..." />
      </Container>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

