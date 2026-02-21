import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import Fees from './pages/Fees'
import Courses from './pages/Courses'
import Hostel from './pages/Hostel'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: 'Inter, sans-serif',
        fontSize: '18px',
        color: '#0d7377',
      }}>
        Loading...
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />
}

function App() {
  return (
    <Routes>
  {/* Public Routes */}
  <Route path="/" element={<Landing />} />
  <Route path="/landing" element={<Landing />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected Routes */}
  <Route
    path="/"
    element={
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    }
  >
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="documents" element={<Documents />} />
    <Route path="fees" element={<Fees />} />
    <Route path="courses" element={<Courses />} />
    <Route path="hostel" element={<Hostel />} />
    <Route path="profile" element={<Profile />} />
    <Route
      path="admin"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />
  </Route>
</Routes>
  )
}

export default App
