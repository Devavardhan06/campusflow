import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Chip,
  CircularProgress,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { useState } from 'react'
import api from '../services/api'

function ChatAssistant({ open, onClose }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!question.trim()) return

    const userMessage = { role: 'user', content: question }
    setMessages([...messages, userMessage])
    setLoading(true)
    const currentQuestion = question
    setQuestion('')

    try {
      const response = await api.post('/ai/chat', { question: currentQuestion })
      setMessages([
        ...messages,
        userMessage,
        { role: 'assistant', content: response.data.answer, suggestions: response.data.suggestions },
      ])
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages([
        ...messages,
        userMessage,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          height: '600px',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon sx={{ color: '#2EC4B6' }} />
          <Typography variant="h6" fontWeight={700}>AI Assistant</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <SmartToyIcon sx={{ fontSize: 64, color: '#2EC4B6', opacity: 0.5, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Ask me anything!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                I can help with documents, fees, courses, hostel, and more.
              </Typography>
            </Box>
          ) : (
            <List sx={{ py: 0 }}>
              {messages.map((msg, idx) => (
                <ListItem
                  key={idx}
                  sx={{
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    px: 0,
                    py: 1,
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      borderRadius: 2,
                      bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.100',
                      color: msg.role === 'user' ? 'white' : 'inherit',
                    }}
                  >
                    <Typography variant="body1">{msg.content}</Typography>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {msg.suggestions.map((suggestion, i) => (
                          <Chip
                            key={i}
                            label={suggestion}
                            size="small"
                            sx={{
                              bgcolor: msg.role === 'user' ? 'rgba(255,255,255,0.2)' : 'white',
                              color: msg.role === 'user' ? 'white' : 'inherit',
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Paper>
                </ListItem>
              ))}
              {loading && (
                <ListItem sx={{ justifyContent: 'flex-start', px: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      Thinking...
                    </Typography>
                  </Box>
                </ListItem>
              )}
            </List>
          )}
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="medium"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={loading || !question.trim()}
              sx={{
                minWidth: 100,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ChatAssistant
