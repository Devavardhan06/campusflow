import { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  Button,
  Chip,
  Typography,
  Box,
  Grid,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import DescriptionIcon from '@mui/icons-material/Description'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import api from '../services/api'

const STATUS_CONFIG = {
  verified: { color: 'success', icon: CheckCircleIcon, label: 'Verified' },
  uploaded: { color: 'info', icon: PendingIcon, label: 'Pending Verification' },
  pending: { color: 'default', icon: PendingIcon, label: 'Not Uploaded' },
}

const ALLOWED_TYPES = '.pdf,.jpg,.jpeg,.png,.doc,.docx'

const REQUIRED_DOCUMENTS_FALLBACK = [
  { type: 'id_proof', label: 'ID Proof', description: 'Aadhar Card, Passport or Voter ID', status: 'pending' },
  { type: 'address_proof', label: 'Address Proof', description: 'Utility bill or rental agreement', status: 'pending' },
  { type: 'academic_transcript', label: 'Academic Transcript', description: 'Latest mark sheet or degree certificate', status: 'pending' },
  { type: 'medical_certificate', label: 'Medical Certificate', description: 'Fitness certificate from registered doctor', status: 'pending' },
  { type: 'photo', label: 'Passport Photo', description: 'Recent passport-size photograph', status: 'pending' },
]

function Documents() {
  const [documents, setDocuments] = useState(REQUIRED_DOCUMENTS_FALLBACK)
  const [stats, setStats] = useState({ completed: 0, total: 5, percentage: 0 })
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileUrl, setFileUrl] = useState('')
  const [uploadMode, setUploadMode] = useState('file')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents/')
      const docs = response.data.documents || []
      setDocuments(docs.length > 0 ? docs : REQUIRED_DOCUMENTS_FALLBACK)
      setStats(response.data.stats || { completed: 0, total: 5, percentage: 0 })
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      setDocuments(REQUIRED_DOCUMENTS_FALLBACK)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFileUrl('')
    }
  }

  const handleUpload = async () => {
    if (!selectedDoc) return

    const docType = selectedDoc.document_type || selectedDoc.type
    if (!docType) return

    setUploading(true)
    try {
      if (uploadMode === 'file' && selectedFile) {
        const formData = new FormData()
        formData.append('document_type', docType)
        formData.append('file', selectedFile)
        await api.post('/documents/upload-file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else if (fileUrl.trim()) {
        await api.post('/documents/upload', { document_type: docType, file_url: fileUrl })
      } else {
        alert('Please select a file or enter a URL')
        setUploading(false)
        return
      }
      setUploadDialogOpen(false)
      setSelectedDoc(null)
      setSelectedFile(null)
      setFileUrl('')
      fetchDocuments()
    } catch (error) {
      console.error('Upload failed:', error)
      alert(error.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const openUpload = (doc) => {
    setSelectedDoc(doc)
    setSelectedFile(null)
    setFileUrl(doc.file_url || '')
    setUploadDialogOpen(true)
    setUploadMode('file')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const pendingDocs = documents.filter(d => d.status === 'pending' || d.status === 'uploaded')

  const getFileUrl = (doc) => {
    const url = doc.file_url
    if (!url) return null
    return url.startsWith('/') ? url : `/${url}`
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#1A202C', mb: 1 }}>
            Documents
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Upload and manage your onboarding documents
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<UploadIcon />}
          onClick={() => {
            if (pendingDocs.length === 0) {
              alert('All documents verified!')
              return
            }
            setSelectedDoc(pendingDocs[0])
            setSelectedFile(null)
            setFileUrl('')
            setUploadMode('file')
            setUploadDialogOpen(true)
            if (fileInputRef.current) fileInputRef.current.value = ''
          }}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
          }}
        >
          Upload Document
        </Button>
      </Box>

      <Card
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
          color: 'white',
          border: 'none',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <Typography variant="h6" gutterBottom sx={{ opacity: 0.95 }}>Document Completion</Typography>
              <Typography variant="h2" fontWeight={800}>{stats.percentage}%</Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                {stats.completed} of {stats.total} documents verified
              </Typography>
            </Box>
            <Box sx={{ flex: '2 1 300px', minWidth: 200 }}>
              <LinearProgress
                variant="determinate"
                value={stats.percentage}
                sx={{
                  height: 14,
                  borderRadius: 7,
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: 7 },
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Upload area - visible on page */}
      <Card
        sx={{
          mb: 4,
          border: '2px dashed',
          borderColor: 'primary.main',
          bgcolor: 'rgba(46, 196, 182, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.dark',
            bgcolor: 'rgba(46, 196, 182, 0.1)',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CloudUploadIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Upload a document
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select a document type below and upload your file (PDF, JPG, PNG, DOC, DOCX), or click the button to open the upload dialog.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => {
                const next = pendingDocs[0] || documents[0]
                if (next) {
                  setSelectedDoc(next)
                  setSelectedFile(null)
                  setFileUrl('')
                  setUploadMode('file')
                  setUploadDialogOpen(true)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }
              }}
              disabled={pendingDocs.length === 0}
              sx={{
                background: 'linear-gradient(135deg, #2EC4B6 0%, #14A3A8 100%)',
              }}
            >
              {pendingDocs.length === 0 ? 'All documents uploaded' : 'Open upload'}
            </Button>
            <Typography variant="body2" color="text.secondary">
              Or click any document card below to upload for that type.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#1A202C' }}>
        Required Documents
      </Typography>
      <Grid container spacing={3}>
        {documents.map((doc) => {
          const docType = doc.document_type || doc.type
          const config = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending
          const StatusIcon = config.icon
          const canUpload = doc.status === 'pending' || doc.status === 'uploaded'
          const viewUrl = getFileUrl(doc)

          return (
            <Grid item xs={12} sm={6} md={4} key={doc.id || docType}>
              <Card
                sx={{
                  height: '100%',
                  borderLeft: 4,
                  borderColor: doc.status === 'verified' ? 'success.main' : doc.status === 'uploaded' ? 'info.main' : 'grey.300',
                  cursor: canUpload ? 'pointer' : 'default',
                  transition: 'transform 0.2s',
                  '&:hover': canUpload ? { transform: 'translateY(-4px)' } : {},
                }}
                onClick={() => canUpload && openUpload(doc)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.8 }} />
                    <Chip
                      icon={<StatusIcon sx={{ fontSize: 18 }} />}
                      label={config.label}
                      color={config.color}
                      size="small"
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {doc.label || docType?.replace(/_/g, ' ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {doc.description || 'Required document'}
                  </Typography>
                  {doc.file_url ? (
                    <Box>
                      <Typography variant="caption" display="block" color="primary.main">
                        ✓ Uploaded
                      </Typography>
                      {viewUrl && (
                        <Button
                          size="small"
                          component="a"
                          href={viewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mt: 0.5 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View file
                        </Button>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Click to upload
                    </Typography>
                  )}
                  {doc.verified_at && (
                    <Typography variant="caption" display="block" color="success.main" sx={{ mt: 0.5 }}>
                      Verified {new Date(doc.verified_at).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Dialog open={uploadDialogOpen} onClose={() => !uploading && setUploadDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          {documents.length > 1 && (
            <TextField
              fullWidth
              select
              label="Document Type"
              value={selectedDoc?.document_type || selectedDoc?.type || ''}
              onChange={(e) => {
                const doc = documents.find(d => (d.document_type || d.type) === e.target.value)
                setSelectedDoc(doc)
                setFileUrl(doc?.file_url || '')
                setSelectedFile(null)
              }}
              margin="normal"
              SelectProps={{ native: true }}
            >
              {documents.filter(d => d.status !== 'verified').map((d) => (
                <option key={d.id || d.document_type} value={d.document_type || d.type}>
                  {d.label || d.document_type?.replace(/_/g, ' ')}
                </option>
              ))}
            </TextField>
          )}

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant={uploadMode === 'file' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => { setUploadMode('file'); setFileUrl('') }}
              >
                Upload file
              </Button>
              <Button
                variant={uploadMode === 'url' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => { setUploadMode('url'); setSelectedFile(null) }}
              >
                Paste URL
              </Button>
            </Box>

            {uploadMode === 'file' ? (
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'action.hover',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_TYPES}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  {selectedFile ? selectedFile.name : 'Click or drag to select file'}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  PDF, JPG, PNG, DOC, DOCX (max 10MB)
                </Typography>
              </Box>
            ) : (
              <TextField
                fullWidth
                label="File URL"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                margin="normal"
                placeholder="https://example.com/your-document.pdf"
                helperText="Paste the URL of your document"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedDoc || (uploadMode === 'file' ? !selectedFile : !fileUrl.trim())}
          >
            {uploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Documents
