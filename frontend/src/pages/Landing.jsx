import { Box, Container, Typography, Button, Grid, Card, CardContent, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SchoolIcon from '@mui/icons-material/School'
import ChatIcon from '@mui/icons-material/Chat'
import ChecklistIcon from '@mui/icons-material/Checklist'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import SecurityIcon from '@mui/icons-material/Security'
import BoltIcon from '@mui/icons-material/Bolt'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

const features = [
  {
    icon: <ChatIcon sx={{ fontSize: 40 }} />,
    title: 'AI Chat Assistant',
    description: 'Get instant answers to onboarding queries with context-aware AI.',
  },
  {
    icon: <ChecklistIcon sx={{ fontSize: 40 }} />,
    title: 'Smart Checklists',
    description: 'Auto-prioritized tasks with deadline tracking and nudges.',
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
    title: 'Real-time Analytics',
    description: 'Track onboarding progress across departments in real time.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Secure & Compliant',
    description: 'Role-based access with encrypted document storage.',
  },
  {
    icon: <BoltIcon sx={{ fontSize: 40 }} />,
    title: 'Workflow Automation',
    description: 'Automate document verification, fee sync, and LMS enrollment.',
  },
  {
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />,
    title: 'Admin Controls',
    description: 'Bulk communications, drop-off detection, and escalation tools.',
  },
]

const stats = [
  { value: '50+', label: 'Colleges' },
  { value: '1.2M', label: 'Students Onboarded' },
  { value: '72%', label: 'Faster Onboarding' },
  { value: '98%', label: 'Satisfaction Rate' },
]

function Landing() {
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Chip
              icon={<AutoAwesomeIcon />}
              label="AI-Powered Student Onboarding"
              sx={{
                mb: 3,
                bgcolor: 'rgba(46, 196, 182, 0.2)',
                color: '#2EC4B6',
                border: '1px solid #2EC4B6',
                fontWeight: 600,
                py: 2,
                px: 1,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                mb: 2,
                background: 'linear-gradient(135deg, #ffffff 0%, #2EC4B6 50%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              One Platform.
            </Typography>
            <Typography variant="h1" sx={{ mb: 2, color: '#2EC4B6' }}>
              Zero Chaos.
            </Typography>
            <Typography variant="h1" sx={{ mb: 4 }}>
              Smart Onboarding.
            </Typography>
            <Typography variant="h6" sx={{ mb: 6, color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
              CampusFlow AI replaces fragmented portals with an intelligent agent that guides every student
              from admission to campus life — automatically.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
                }}
              >
                Student Portal
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Admin Dashboard
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#2EC4B6', fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F7FAFC' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2, fontWeight: 800, color: '#1A202C' }}>
              Everything You Need
            </Typography>
            <Typography variant="h6" sx={{ color: '#718096', fontWeight: 400, maxWidth: '600px', mx: 'auto' }}>
              A unified AI agent that handles every stage of the student onboarding lifecycle.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    bgcolor: 'white',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
              Ready to Transform Onboarding?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
              Join 50+ colleges using CampusFlow AI to deliver seamless student experiences.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/register')}
              sx={{
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#F7FAFC' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon sx={{ color: '#2EC4B6', fontSize: 28 }} />
              <Typography variant="h6" sx={{ color: '#718096', fontWeight: 600 }}>
                CampusFlow AI
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#718096' }}>
              © 2025 CampusFlow AI. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Landing
