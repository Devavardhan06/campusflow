import { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  CircularProgress,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WarningIcon from '@mui/icons-material/Warning'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import api from '../services/api'

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    fetchStudents()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Failed to fetch admin dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students')
      setStudents(response.data.students || [])
    } catch (error) {
      console.error('Failed to fetch students:', error)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!dashboardData) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">Failed to load dashboard data</Typography>
      </Box>
    )
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return 'error'
      case 'MEDIUM': return 'warning'
      default: return 'success'
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: '#1A202C', mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          Monitor student onboarding progress and analytics
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
              color: 'white',
              border: 'none',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PeopleIcon sx={{ fontSize: 48, opacity: 0.9 }} />
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>Total Students</Typography>
                  <Typography variant="h2" fontWeight={800}>{dashboardData.total_students}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)',
              color: 'white',
              border: 'none',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.9 }} />
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>Average Completion</Typography>
                  <Typography variant="h2" fontWeight={800}>
                    {dashboardData.average_completion.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section Metrics */}
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3, color: '#1A202C' }}>
        Section-wise Completion Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(dashboardData.section_metrics || {}).map(([section, metrics]) => (
          <Grid item xs={12} sm={6} md={3} key={section}>
            <Card
              sx={{
                borderLeft: 4,
                borderColor: 'primary.main',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Typography>
                <Typography variant="h4" fontWeight={700} color="success.main" gutterBottom>
                  {metrics.complete}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete • {metrics.pending} Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Risk Students */}
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#1A202C' }}>
        <WarningIcon sx={{ color: '#f77f00' }} />
        Students at Risk
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Student ID</strong></TableCell>
                  <TableCell align="right"><strong>Completion</strong></TableCell>
                  <TableCell align="right"><strong>Health Score</strong></TableCell>
                  <TableCell align="center"><strong>Risk Level</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.risk_students?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No students at risk</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  dashboardData.risk_students?.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.student_id || '-'}</TableCell>
                      <TableCell align="right">{student.completion?.toFixed(1)}%</TableCell>
                      <TableCell align="right">{student.health_score}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={student.risk?.level}
                          color={getRiskColor(student.risk?.level)}
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

      {/* All Students */}
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#1A202C' }}>
        <AnalyticsIcon sx={{ color: '#2EC4B6' }} />
        All Students
      </Typography>
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Student ID</strong></TableCell>
                  <TableCell align="right"><strong>Completion</strong></TableCell>
                  <TableCell align="right"><strong>Health Score</strong></TableCell>
                  <TableCell align="center"><strong>Risk Level</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No students found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.student_id || '-'}</TableCell>
                      <TableCell align="right">{student.completion?.toFixed(1)}%</TableCell>
                      <TableCell align="right">{student.health_score}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={student.risk?.level}
                          color={getRiskColor(student.risk?.level)}
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
    </Box>
  )
}

export default AdminDashboard
