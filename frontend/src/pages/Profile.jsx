import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  CircularProgress,
  Grid,
  Chip,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import EditIcon from '@mui/icons-material/Edit'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { user, fetchUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile/')
      setProfile(response.data)
      setFormData({
        full_name: response.data.full_name || '',
        avatar_url: response.data.avatar_url || '',
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      await api.put('/profile/', formData)
      setEditing(false)
      fetchProfile()
      fetchUser()
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile')
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!profile) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">Failed to load profile</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1A202C', mb: 1 }}>
            Profile
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Manage your profile information
          </Typography>
        </Box>
        {!editing && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditing(true)}
            sx={{
              background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
            }}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Avatar
                  src={profile.avatar_url}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                  }}
                >
                  {!profile.avatar_url && (
                    <PersonIcon sx={{ fontSize: 60 }} />
                  )}
                </Avatar>
                <Typography variant="h5" fontWeight={700}>{profile.full_name}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  {profile.email}
                </Typography>
                {profile.student_id && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Student ID: {profile.student_id}
                  </Typography>
                )}
                <Chip
                  label={profile.role?.toUpperCase()}
                  color={profile.role === 'admin' ? 'secondary' : 'primary'}
                  sx={{ mt: 2 }}
                />
              </Box>

              {editing ? (
                <Box>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    margin="normal"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Avatar URL"
                    value={formData.avatar_url}
                    onChange={(e) =>
                      setFormData({ ...formData, avatar_url: e.target.value })
                    }
                    margin="normal"
                    sx={{ mb: 3 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleUpdate}
                      sx={{
                        background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button variant="outlined" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : null}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                Completion Status
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" fontWeight={500}>Profile Completion</Typography>
                  <Typography variant="body1" fontWeight={600} color="primary.main">
                    {profile.profile_completion}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={profile.profile_completion}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: 'grey.200',
                  }}
                  color="primary"
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" fontWeight={500}>Onboarding Completion</Typography>
                  <Typography variant="body1" fontWeight={600} color="primary.main">
                    {profile.onboarding_completion.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={profile.onboarding_completion}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: 'grey.200',
                  }}
                  color="success"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile
