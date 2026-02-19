import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './ErrorBoundary'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2EC4B6', // Teal/Cyan
      light: '#4FD1C7',
      dark: '#1A9B8F',
      contrastText: '#fff',
    },
    secondary: {
      main: '#14A3A8',
      light: '#2EC4B6',
      dark: '#0d7377',
      contrastText: '#fff',
    },
    success: { main: '#2d6a4f' },
    warning: { main: '#f77f00' },
    error: { main: '#d62828' },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1A202C',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, fontSize: '3.5rem', lineHeight: 1.2 },
    h2: { fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.3 },
    h3: { fontWeight: 700, fontSize: '2rem', lineHeight: 1.3 },
    h4: { fontWeight: 700, fontSize: '1.75rem' },
    h5: { fontWeight: 600, fontSize: '1.5rem' },
    h6: { fontWeight: 600, fontSize: '1.25rem' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': { 
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { 
          borderRadius: 12, 
          textTransform: 'none', 
          fontWeight: 600,
          padding: '12px 32px',
          fontSize: '1rem',
        },
        contained: {
          background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1A9B8F 0%, #0d7377 100%)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 10, fontWeight: 500 },
      },
    },
  },
})

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<div style="padding:20px;font-family:sans-serif;">Root element #root not found.</div>'
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  )
}
