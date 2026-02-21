import { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  LinearProgress,
  Divider
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import EventIcon from '@mui/icons-material/Event'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import api from '../services/api'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/overview')
      setData(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    )
  }

  if (!data) return null

  return (
    <Box sx={{ px: 4, py: 5, background: '#F4F6F8', minHeight: '100vh' }}>

      {/* Header */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={700}>
          Welcome back
        </Typography>
        <Typography color="text.secondary">
          Here’s your onboarding progress overview
        </Typography>
      </Box>

      {/* KPI CARDS */}
      <Grid container spacing={3} mb={5}>
        {[
          {
            label: 'Overall Progress',
            value: `${data.completion?.total_completion?.toFixed(0)}%`,
            icon: <TrendingUpIcon />,
            accent: '#0EA5E9'
          },
          {
            label: 'Health Score',
            value: data.health_score,
            icon: <TaskAltIcon />,
            accent: '#10B981'
          },
          {
            label: 'Documents',
            value: `${data.completion?.documents}%`,
            icon: <CheckCircleIcon />,
            accent: '#6366F1'
          },
          {
            label: 'Fees',
            value: `${data.completion?.fees}%`,
            icon: <EventIcon />,
            accent: '#F59E0B'
          }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {item.label}
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {item.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      background: item.accent + '15',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.accent
                    }}
                  >
                    {item.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* MAIN SECTION */}
      <Grid container spacing={4}>

        {/* LEFT SIDE */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={3}>
                Onboarding Checklist
              </Typography>

              <Box mb={3}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Overall Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={data.completion?.total_completion}
                  sx={{
                    height: 8,
                    borderRadius: 5
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" alignItems="center" gap={2}>
                <Chip
                  label={data.next_best_action?.priority?.toUpperCase()}
                  color={
                    data.next_best_action?.priority === 'high'
                      ? 'error'
                      : 'default'
                  }
                  size="small"
                />
                <Typography>
                  {data.next_best_action?.action}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <SmartToyIcon sx={{ color: '#0EA5E9' }} />
                <Typography variant="h6" fontWeight={600}>
                  AI Insight
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={3}>
                {data.risk?.message}
              </Typography>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                Start Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  )
}

export default Dashboard