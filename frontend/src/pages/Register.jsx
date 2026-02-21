import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
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
function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    student_id: '',
    role: 'student',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(formData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
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
        <Box>
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

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            Start Your Campus Journey
          </Typography>

          <Typography
            sx={{
              fontSize: '1.1rem',
              opacity: 0.9,
              mb: 4,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Create your account and complete onboarding with AI-powered
            guidance and real-time progress tracking.
          </Typography>

          <Typography sx={{ opacity: 0.8 }}>
            Join 1,200+ students already onboarded
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
          elevation={12}
          sx={{
            p: 5,
            borderRadius: 4,
            width: '100%',
            maxWidth: 460,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            Create Account
          </Typography>

          <Typography sx={{ color: 'text.secondary', mb: 3 }}>
            Start your onboarding journey
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Student ID"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
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
                background:
                  'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
                transition: '0.3s',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #14A3A8 0%, #0F766E 100%)',
                },
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography sx={{ color: 'text.secondary', mb: 1 }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#2EC4B6',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Login
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

export default Register