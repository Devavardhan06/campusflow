import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  CircularProgress,
} from '@mui/material'
import PaymentIcon from '@mui/icons-material/Payment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import api from '../services/api'

const DEFAULT_FEE_STRUCTURE = [
  { name: 'Tuition Fee', amount: 35000, description: 'Academic semester fees' },
  { name: 'Hostel Fee', amount: 12000, description: 'Accommodation charges' },
  { name: 'Lab Fee', amount: 2500, description: 'Laboratory and practical fees' },
  { name: 'Library Fee', amount: 500, description: 'Library membership' },
  { name: 'Sports & Activities', amount: 1000, description: 'Sports facility and extracurricular' },
]

const DEFAULT_FEE = {
  total_amount: 50500,
  paid_amount: 0,
  remaining_amount: 50500,
  fee_structure: DEFAULT_FEE_STRUCTURE,
  paid_percentage: 0,
}

function Fees() {
  const [fee, setFee] = useState(DEFAULT_FEE)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('online')

  useEffect(() => {
    fetchFeeStatus()
    fetchTransactions()
  }, [])

  const fetchFeeStatus = async () => {
    try {
      const response = await api.get('/fees/')
      setFee(response.data)
      setError(null)
    } catch (error) {
      console.error('Failed to fetch fee status:', error)
      setError('Unable to load fee information. Showing default structure.')
      setFee(DEFAULT_FEE)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/fees/transactions')
      setTransactions(response.data.transactions || [])
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }

  const handlePayment = async () => {
    try {
      await api.post('/fees/pay', {
        amount: parseFloat(paymentAmount),
        payment_method: paymentMethod,
      })
      setPaymentDialogOpen(false)
      setPaymentAmount('')
      fetchFeeStatus()
      fetchTransactions()
    } catch (error) {
      console.error('Payment failed:', error)
      alert(error.response?.data?.detail || 'Payment failed')
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    )
  }

  const paidPercentage = fee?.paid_percentage || (fee?.paid_amount / fee?.total_amount) * 100 || 0
  const isFullyPaid = (fee?.remaining_amount || 0) <= 0
  const feeStructure = fee?.fee_structure || DEFAULT_FEE_STRUCTURE

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: '#1A202C', mb: 1 }}>
          Fee Payment
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          View fee structure, make payments, and track transactions
        </Typography>
      </Box>
      
      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
          <Typography variant="body2" color="warning.dark">{error}</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Summary Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              borderTop: 4,
              borderColor: isFullyPaid ? 'success.main' : 'warning.main',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AccountBalanceIcon color="primary" />
                <Typography variant="h6">Fee Summary</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Total Amount</Typography>
                <Typography fontWeight={600}>₹{(fee?.total_amount || 0).toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Paid</Typography>
                <Typography fontWeight={600} color="success.main">₹{(fee?.paid_amount || 0).toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Remaining</Typography>
                <Typography fontWeight={600} color={isFullyPaid ? 'success.main' : 'error.main'}>
                  ₹{(fee?.remaining_amount || 0).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2" fontWeight={600}>{paidPercentage?.toFixed(1)}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={paidPercentage}
                  sx={{ height: 10, borderRadius: 5 }}
                  color={isFullyPaid ? 'success' : 'primary'}
                />
              </Box>
              <Chip
                icon={isFullyPaid ? <CheckCircleIcon /> : <WarningIcon />}
                label={isFullyPaid ? 'Fully Paid' : 'Pending'}
                color={isFullyPaid ? 'success' : 'warning'}
                sx={{ width: '100%', py: 1.5 }}
              />
              {!isFullyPaid && (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PaymentIcon />}
                  onClick={() => setPaymentDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Make Payment
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Fee Structure */}
        <Grid item xs={12} md={8}>
          <Card sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3, color: '#1A202C' }}>
                Fee Structure
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Component</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                      <TableCell align="right"><strong>Amount (₹)</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feeStructure.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                          {item.description || '-'}
                        </TableCell>
                        <TableCell align="right">{item.amount?.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                      <TableCell colSpan={2}><strong>Total</strong></TableCell>
                      <TableCell align="right"><strong>₹{(fee?.total_amount || 0).toLocaleString()}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Transaction History */}
        <Grid item xs={12}>
          <Card sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#1A202C', mb: 2 }}>
                Transaction History
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Payment Method</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No transactions yet</Typography>
                          <Typography variant="body2" color="text.secondary">Make your first payment to see history</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell sx={{ fontFamily: 'monospace' }}>{txn.transaction_id}</TableCell>
                          <TableCell><strong>₹{txn.amount?.toLocaleString()}</strong></TableCell>
                          <TableCell>{txn.payment_method}</TableCell>
                          <TableCell>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                          <TableCell><Chip label={txn.status} color="success" size="small" /></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Make Payment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount (₹)"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            margin="normal"
            inputProps={{ min: 1, max: fee?.remaining_amount || 0 }}
          />
          <TextField
            fullWidth
            select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="online">Online</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </TextField>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Max: ₹{(fee?.remaining_amount || 0).toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handlePayment}
            variant="contained"
            disabled={!paymentAmount || parseFloat(paymentAmount) > (fee?.remaining_amount || 0)}
          >
            Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Fees
