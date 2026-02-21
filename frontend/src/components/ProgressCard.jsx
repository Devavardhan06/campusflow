import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material'
import { keyframes } from '@mui/system'

const shimmer = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`

const colorMap = {
  primary: '#2EC4B6',
  success: '#16A34A',
  info: '#3B82F6',
  warning: '#F97316',
}

function ProgressCard({ title, value = 0, color = 'primary' }) {
  const accent = colorMap[color] || colorMap.primary

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* Accent Gradient Line */}
      <Box
        sx={{
          height: 4,
          width: '100%',
          background: `linear-gradient(90deg, ${accent}, #ffffff)`,
        }}
      />

      {/* Shimmer */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.3), transparent 70%)',
          animation: `${shimmer} 8s infinite`,
        }}
      />

      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: accent,
            mb: 2,
          }}
        >
          {value.toFixed(0)}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: 8,
            borderRadius: 5,
            backgroundColor: '#E5E7EB',
            '& .MuiLinearProgress-bar': {
              background: accent,
            },
          }}
        />
      </CardContent>
    </Card>
  )
}

export default ProgressCard