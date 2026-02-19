import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import LockIcon from '@mui/icons-material/Lock'
import api from '../services/api'

function Courses() {
  const [availableCourses, setAvailableCourses] = useState([])
  const [myCourses, setMyCourses] = useState([])
  const [selectedCourses, setSelectedCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [locked, setLocked] = useState(false)
  const [feePercentage, setFeePercentage] = useState(0)

  useEffect(() => {
    fetchCourses()
    fetchMyCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/')
      setAvailableCourses(response.data.courses || [])
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const fetchMyCourses = async () => {
    try {
      const response = await api.get('/courses/my-courses')
      setMyCourses(response.data.courses || [])
      setLocked(response.data.locked || false)
      setFeePercentage(response.data.fee_percentage || 0)
    } catch (error) {
      console.error('Failed to fetch my courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    )
  }

  const handleRegister = async () => {
    try {
      await api.post('/courses/register', { course_ids: selectedCourses })
      setSelectedCourses([])
      fetchMyCourses()
      fetchCourses()
    } catch (error) {
      console.error('Registration failed:', error)
      alert(error.response?.data?.detail || 'Registration failed')
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: '#1A202C', mb: 1 }}>
          Courses
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          View your enrolled courses and register for new ones
        </Typography>
      </Box>

      {locked && (
        <Alert
          severity="warning"
          icon={<LockIcon />}
          sx={{ mb: 4, borderRadius: 2 }}
        >
          Complete at least 50% fee payment to register for courses. Current: {feePercentage?.toFixed(0)}%
        </Alert>
      )}

      {/* My Learning - Enrolled Courses */}
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mt: 4, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#1A202C' }}>
        <AutoStoriesIcon sx={{ color: '#2EC4B6' }} />
        My Learning
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {myCourses.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'grey.50', border: '2px dashed', borderColor: 'grey.300' }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <SchoolIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No courses enrolled yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locked ? 'Complete fee payment to unlock course registration' : 'Select courses below and click Register'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          myCourses.map((sc) => (
            <Grid item xs={12} sm={6} md={4} key={sc.id}>
              <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'primary.main' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip label="Enrolled" color="success" size="small" />
                    <Chip
                      label={sc.lms_activated ? 'LMS Active' : 'LMS Inactive'}
                      color={sc.lms_activated ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {sc.course?.course_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {sc.course?.course_code} • {sc.course?.credits} credits
                  </Typography>
                  {sc.course?.description && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      {sc.course.description}
                    </Typography>
                  )}
                  {!sc.lms_activated && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={async () => {
                        try {
                          await api.put(`/courses/${sc.course_id}/activate-lms`)
                          fetchMyCourses()
                        } catch (e) {
                          console.error(e)
                        }
                      }}
                      sx={{ mt: 2 }}
                    >
                      Activate LMS
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Available Courses */}
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#1A202C' }}>
        <SchoolIcon sx={{ color: '#2EC4B6' }} />
        Available Courses
      </Typography>
      <Grid container spacing={3}>
        {availableCourses.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No courses available. Admin can add courses.</Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          availableCourses.map((course) => {
            const isEnrolled = myCourses.some((sc) => sc.course_id === course.id)
            const isSelected = selectedCourses.includes(course.id)

            return (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card
                  sx={{
                    height: '100%',
                    opacity: isEnrolled ? 0.95 : 1,
                    border: isSelected ? 2 : 0,
                    borderColor: 'primary.main',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" color="primary.main">
                        {course.course_code}
                      </Typography>
                      {isEnrolled ? (
                        <Chip label="Learning" color="success" size="small" />
                      ) : (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleToggleCourse(course.id)}
                              disabled={locked}
                            />
                          }
                          label="Select"
                        />
                      )}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {course.course_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.credits} credits
                    </Typography>
                    {course.description && (
                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        {course.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )
          })
        )}
      </Grid>

      {selectedCourses.length > 0 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SchoolIcon />}
            onClick={handleRegister}
            disabled={locked}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Register for {selectedCourses.length} Course(s)
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Courses
