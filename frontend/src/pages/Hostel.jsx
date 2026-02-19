import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import EventIcon from '@mui/icons-material/Event'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import api from '../services/api'

function Hostel() {
  const [application, setApplication] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [isHosteller, setIsHosteller] = useState(false)
  const [availableHostels, setAvailableHostels] = useState([])
  const [loading, setLoading] = useState(true)
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [preferences, setPreferences] = useState({
    preference_1: '',
    preference_2: '',
    preference_3: '',
  })

  useEffect(() => {
    fetchHostelStatus()
    fetchAvailableHostels()
  }, [])

  const fetchHostelStatus = async () => {
    try {
      const response = await api.get('/hostel/')
      setApplication(response.data.application)
      setAttendance(response.data.attendance || [])
      setIsHosteller(response.data.is_hosteller || false)
    } catch (error) {
      console.error('Failed to fetch hostel status:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableHostels = async () => {
    try {
      const response = await api.get('/hostel/available')
      setAvailableHostels(response.data.hostels || [])
    } catch (error) {
      console.error('Failed to fetch hostels:', error)
    }
  }

  const handleApply = async () => {
    try {
      await api.post('/hostel/apply', preferences)
      setApplyDialogOpen(false)
      setPreferences({ preference_1: '', preference_2: '', preference_3: '' })
      fetchHostelStatus()
    } catch (error) {
      console.error('Application failed:', error)
      alert(error.response?.data?.detail || 'Application failed')
    }
  }

  const handleMessRegister = async () => {
    try {
      await api.put('/hostel/mess-register')
      fetchHostelStatus()
    } catch (error) {
      console.error('Mess registration failed:', error)
      alert(error.response?.data?.detail || 'Mess registration failed')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success'
      case 'absent': return 'error'
      case 'leave': return 'warning'
      default: return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'present': return 'Present'
      case 'absent': return 'Absent'
      case 'leave': return 'On Leave'
      default: return status
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1A202C', mb: 1 }}>
            Hostel
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Hostel status, accommodation, and daily attendance
          </Typography>
        </Box>
        {!application && (
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => setApplyDialogOpen(true)}
            sx={{ borderRadius: 2, px: 3, py: 1.5 }}
          >
            Apply for Hostel
          </Button>
        )}
      </Box>

      {/* Status Banner */}
      <Card
        sx={{
          mb: 4,
          background: isHosteller
            ? 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)'
            : 'linear-gradient(135deg, #718096 0%, #A0AEC0 100%)',
          color: 'white',
          border: 'none',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {isHosteller ? (
              <>
                <HomeIcon sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="h5" fontWeight={700}>Hosteller</Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {application?.allocated_hostel} • Room {application?.allocated_room}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <PersonOffIcon sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {application ? 'Not Yet Allocated' : 'Non-Hosteller'}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {application
                      ? 'Your application is under review'
                      : 'Apply for hostel accommodation'}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {application && (
        <Grid container spacing={3}>
          {/* Application Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Application Details</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    label={application.status}
                    color={
                      application.status === 'allocated'
                        ? 'success'
                        : application.status === 'rejected'
                        ? 'error'
                        : 'warning'
                    }
                  />
                </Box>
                {application.allocated_hostel && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Hostel</Typography>
                    <Typography variant="h6">{application.allocated_hostel}</Typography>
                  </Box>
                )}
                {application.allocated_room && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Room</Typography>
                    <Typography variant="h6">{application.allocated_room}</Typography>
                  </Box>
                )}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Preferences</Typography>
                  <Typography>1. {application.preferences?.preference_1 || '-'}</Typography>
                  <Typography>2. {application.preferences?.preference_2 || '-'}</Typography>
                  <Typography>3. {application.preferences?.preference_3 || '-'}</Typography>
                </Box>
                {isHosteller && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>Mess</Typography>
                    <Chip
                      label={application.mess_registration === 'registered' ? 'Registered' : 'Not Registered'}
                      color={application.mess_registration === 'registered' ? 'success' : 'default'}
                      sx={{ mr: 1 }}
                    />
                    {application.mess_registration !== 'registered' && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RestaurantIcon />}
                        onClick={handleMessRegister}
                        sx={{ mt: 1 }}
                      >
                        Register for Mess
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Attendance */}
          {isHosteller && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon color="primary" />
                    Day-to-Day Attendance
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Last 14 days
                  </Typography>
                  <TableContainer sx={{ maxHeight: 320 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {attendance.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                              <Typography color="text.secondary">No attendance records</Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          attendance.map((record, i) => (
                            <TableRow key={record.id || i}>
                              <TableCell>
                                {new Date(record.date).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  label={getStatusLabel(record.status)}
                                  color={getStatusColor(record.status)}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {!application && (
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
          You haven't applied for hostel accommodation. Click the button above to submit your application with hostel preferences.
        </Alert>
      )}

      {/* Available Hostels */}
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mt: 4, mb: 3, color: '#1A202C' }}>
        Available Hostels
      </Typography>
      <Grid container spacing={2}>
        {availableHostels.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No hostels listed. Admin can add hostels.</Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          availableHostels.map((hostel) => (
            <Grid item xs={12} sm={6} md={3} key={hostel.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{hostel.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {hostel.capacity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available: {hostel.available_rooms} rooms
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Apply for Hostel</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Preference 1</InputLabel>
            <Select
              value={preferences.preference_1}
              label="Preference 1"
              onChange={(e) => setPreferences({ ...preferences, preference_1: e.target.value })}
            >
              <MenuItem value="">Select hostel</MenuItem>
              {availableHostels.map((h) => (
                <MenuItem key={h.id} value={h.name}>{h.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Preference 2</InputLabel>
            <Select
              value={preferences.preference_2}
              label="Preference 2"
              onChange={(e) => setPreferences({ ...preferences, preference_2: e.target.value })}
            >
              <MenuItem value="">Select hostel</MenuItem>
              {availableHostels.map((h) => (
                <MenuItem key={h.id} value={h.name}>{h.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Preference 3</InputLabel>
            <Select
              value={preferences.preference_3}
              label="Preference 3"
              onChange={(e) => setPreferences({ ...preferences, preference_3: e.target.value })}
            >
              <MenuItem value="">Select hostel</MenuItem>
              {availableHostels.map((h) => (
                <MenuItem key={h.id} value={h.name}>{h.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApply} variant="contained">
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Hostel
