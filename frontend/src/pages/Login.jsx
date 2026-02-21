import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Paper,
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import { useAuth } from '../context/AuthContext'
import { keyframes } from '@mui/system'

const shine = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      
      {/* LEFT SIDE */}
      <Grid
        item
        md={6}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          px: 10,
          background: 'linear-gradient(135deg, #0F172A 0%, #0D9488 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Box
  sx={{
    width: 70,
    height: 70,
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #2EC4B6, #14A3A8)',
    boxShadow: '0 0 25px rgba(46,196,182,0.5)',
    position: 'relative',
    overflow: 'hidden',
  }}
>
  <SchoolIcon sx={{ fontSize: 32, color: 'white' }} />
  {/* Shimmer Layer */}
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4), transparent 70%)',
       animation: `${shine} 3s infinite`,
    }}
  />
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Your Campus Journey Starts Here
          </Typography>

          <Typography sx={{ fontSize: '1.1rem', opacity: 0.9, mb: 4 }}>
            Complete your onboarding seamlessly with AI-guided steps,
            real-time progress tracking, and instant support.
          </Typography>

          <Typography sx={{ opacity: 0.8 }}>
            1,200+ active users this semester
          </Typography>
        </Box>
      </Grid>

      {/* RIGHT SIDE */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8FAFC',
          px: 3,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 4,
            width: '100%',
            maxWidth: 420,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Student Login
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 3 }}>
            Sign in to continue to CampusFlow AI
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#2EC4B6',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Register
                </Link>
              </Typography>

              <Link
                to="/landing"
                style={{
                  color: '#718096',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                }}
              >
                ← Back to Home
              </Link>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Login