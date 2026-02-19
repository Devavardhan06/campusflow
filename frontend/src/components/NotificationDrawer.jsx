import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState, useEffect } from 'react'
import api from '../services/api'

function NotificationDrawer({ open, onClose, onRead }) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/')
      setNotifications(response.data.notifications)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`)
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
      onRead()
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'risk':
        return 'error'
      case 'deadline':
        return 'warning'
      case 'task_completion':
        return 'success'
      default:
        return 'default'
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Notifications</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {notifications.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No notifications
            </Typography>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.is_read ? 'transparent' : 'action.hover',
                  mb: 1,
                  borderRadius: 1,
                }}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">{notification.title}</Typography>
                      <Chip
                        label={notification.notification_type}
                        size="small"
                        color={getTypeColor(notification.notification_type)}
                      />
                    </Box>
                  }
                  secondary={notification.message}
                />
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Drawer>
  )
}

export default NotificationDrawer
