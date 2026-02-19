import { Card, CardContent, Typography, LinearProgress, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

function ProgressCard({ title, value, color = 'primary' }) {
  const theme = useTheme()
  
  return (
    <Card
      sx={{
        height: '100%',
        borderLeft: 4,
        borderColor: `${color}.main`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 30px ${theme.palette[color].main}20`,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={value}
              color={color}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: `${color}.lighter`,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                },
              }}
            />
          </Box>
          <Typography variant="h5" fontWeight={700} color={`${color}.main`}>
            {value.toFixed(1)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProgressCard
