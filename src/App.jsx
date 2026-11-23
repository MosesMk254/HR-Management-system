import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Login from '@/pages/Login'
import RegistryPage from '@/pages/RegistryPage'
import DepartmentPage from '@/pages/DepartmentPage'

/** Redirect logged-in users to their dashboard; unauthenticated to /login */
function HomeRedirect() {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  return currentUser.department === 'Registry'
    ? <Navigate to="/registry" replace />
    : <Navigate to="/department" replace />
}

/** Protect a route: must be logged in, optionally must be Registry or non-Registry */
function ProtectedRoute({ children, requireRegistry }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  // Registry user trying to access department view — redirect them home
  if (requireRegistry === false && currentUser.department === 'Registry')
    return <Navigate to="/registry" replace />
  // Non-registry user trying to access registry — redirect to dept view
  if (requireRegistry === true && currentUser.department !== 'Registry')
    return <Navigate to="/department" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomeRedirect />} />

      {/* Registry-only */}
      <Route
        path="/registry"
        element={
          <ProtectedRoute requireRegistry={true}>
            <RegistryPage />
          </ProtectedRoute>
        }
      />

      {/* All non-registry departments (single component, reads dept from auth) */}
      <Route
        path="/department"
        element={
          <ProtectedRoute requireRegistry={false}>
            <DepartmentPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
