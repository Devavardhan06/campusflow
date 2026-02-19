import { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Alert,
  CircularProgress,
  LinearProgress,
  Container,
} from '@mui/material'
import ProgressCard from '../components/ProgressCard'
import ChatAssistant from '../components/ChatAssistant'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import api from '../services/api'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/overview')
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!data) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Failed to load dashboard data
        </Typography>
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
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)',
          color: 'white',
          py: 6,
          mb: 4,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                Welcome Back!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                Track your onboarding progress and stay on top of tasks
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<SmartToyIcon />}
              onClick={() => setChatOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
                px: 4,
                py: 1.5,
              }}
            >
              AI Assistant
            </Button>
          </Box>
        </Box>
      </Box>

      {data.risk?.level !== 'LOW' && (
        <Alert
          severity={getRiskColor(data.risk?.level)}
          sx={{ mb: 4, borderRadius: 2 }}
          icon={<TrendingUpIcon />}
        >
          <Typography variant="subtitle2">{data.risk?.level} Risk</Typography>
          {data.risk?.message}
        </Alert>
      )}

      {/* Main Stats Card */}
      <Card
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
          color: 'white',
          border: 'none',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>Overall Completion</Typography>
              <Typography variant="h1" fontWeight={800}>
                {data.completion?.total_completion?.toFixed(1)}%
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                {data.completion?.total_completion?.toFixed(1)}% of onboarding complete
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 200px', textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Health Score</Typography>
              <Typography variant="h2" fontWeight={800}>{data.health_score}</Typography>
            </Box>
            <Box sx={{ flex: '2 1 300px', minWidth: 200 }}>
              <LinearProgress
                variant="determinate"
                value={data.completion?.total_completion || 0}
                sx={{
                  height: 14,
                  borderRadius: 7,
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'white' },
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Progress Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ProgressCard title="Documents" value={data.completion?.documents || 0} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ProgressCard title="Fees" value={data.completion?.fees || 0} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ProgressCard title="Courses" value={data.completion?.courses || 0} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ProgressCard title="Hostel" value={data.completion?.hostel || 0} color="warning" />
        </Grid>
      </Grid>

      {/* Next Action Card */}
      <Card sx={{ borderLeft: 4, borderColor: 'primary.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <CheckCircleIcon color="primary" sx={{ fontSize: 32 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>Next Best Action</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={data.next_best_action?.priority?.toUpperCase()}
                  color={data.next_best_action?.priority === 'high' ? 'error' : 'default'}
                  size="small"
                />
                <Typography variant="body1">{data.next_best_action?.action}</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <ChatAssistant open={chatOpen} onClose={() => setChatOpen(false)} />
    </Box>
  )
}

export default Dashboard
