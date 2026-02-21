import { useNavigate, useLocation } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DescriptionIcon from '@mui/icons-material/Description'
import PaymentIcon from '@mui/icons-material/Payment'
import SchoolIcon from '@mui/icons-material/School'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useAuth } from '../context/AuthContext'

const drawerWidth = 260

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Documents', icon: <DescriptionIcon />, path: '/documents' },
  { text: 'Fees', icon: <PaymentIcon />, path: '/fees' },
  { text: 'Courses', icon: <SchoolIcon />, path: '/courses' },
  { text: 'Hostel', icon: <HomeIcon />, path: '/hostel' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #0F172A 0%, #111827 100%)',
          color: '#E5E7EB',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Toolbar />

      {/* Logo Section */}
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #2EC4B6, #14A3A8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(46,196,182,0.4)',
          }}
        >
          <SchoolIcon sx={{ color: 'white', fontSize: 22 }} />
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
            CampusFlow
          </Typography>
          <Typography sx={{ fontSize: 12, opacity: 0.6 }}>
            AI Dashboard
          </Typography>
        </Box>
      </Box>

      {/* Menu Items */}
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 2,
                    py: 1.3,
                    px: 2,
                    transition: 'all 0.3s ease',
                    background: isSelected
                      ? 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)'
                      : 'transparent',
                    boxShadow: isSelected
                      ? '0 8px 20px rgba(46,196,182,0.35)'
                      : 'none',
                    '&:hover': {
                      background: isSelected
                        ? 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)'
                        : 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isSelected ? 'white' : '#94A3B8',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: 14,
                      color: isSelected ? 'white' : '#CBD5E1',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <ListItem disablePadding sx={{ mt: 1 }}>
              <ListItemButton
                onClick={() => navigate('/admin')}
                sx={{
                  borderRadius: 2,
                  mx: 2,
                  py: 1.3,
                  px: 2,
                  transition: 'all 0.3s ease',
                  background:
                    location.pathname === '/admin'
                      ? 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)'
                      : 'transparent',
                  boxShadow:
                    location.pathname === '/admin'
                      ? '0 8px 20px rgba(249,115,22,0.35)'
                      : 'none',
                  '&:hover': {
                    background:
                      location.pathname === '/admin'
                        ? 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)'
                        : 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color:
                      location.pathname === '/admin'
                        ? 'white'
                        : '#94A3B8',
                  }}
                >
                  <AdminPanelSettingsIcon />
                </ListItemIcon>

                <ListItemText
                  primary="Admin Dashboard"
                  primaryTypographyProps={{
                    fontWeight:
                      location.pathname === '/admin' ? 600 : 500,
                    fontSize: 14,
                    color:
                      location.pathname === '/admin'
                        ? 'white'
                        : '#CBD5E1',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>

      {/* Footer User Info */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: 13,
          color: '#94A3B8',
        }}
      >
        Logged in as
        <Typography sx={{ fontWeight: 600, color: '#E5E7EB' }}>
          {user?.full_name || 'User'}
        </Typography>
      </Box>
    </Drawer>
  )
}

export default Sidebar