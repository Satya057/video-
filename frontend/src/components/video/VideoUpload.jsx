import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  Stack,
  LinearProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VideoUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        // Auto-generate title from filename if title is empty
        if (!formData.title) {
          const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
          setFormData(prev => ({ ...prev, title: fileName }));
        }
      } else {
        setError('Please select a valid video file');
      }
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateMetadata = (file) => {
    return {
      ...formData,
      fileSize: file.size,
      fileType: file.type,
      uploadDate: new Date().toISOString(),
      duration: '00:00', // This would be replaced with actual duration
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a video file');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const metadata = generateMetadata(selectedFile);
      const formDataToSend = new FormData();
      formDataToSend.append('video', selectedFile);
      formDataToSend.append('metadata', JSON.stringify(metadata));

      // Simulating upload progress
      const uploadInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      // Here you would typically make an API call to upload the video
      // For now, we'll simulate a successful upload after 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      clearInterval(uploadInterval);
      setProgress(100);
      navigate('/videos');
    } catch (err) {
      setError(err.message || 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'white', pt: 4 }}>
      <Container maxWidth="md">
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}
          >
            Upload Video
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <input
                accept="video/*"
                style={{ display: 'none' }}
                id="video-file"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="video-file">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ py: 2 }}
                >
                  {selectedFile ? selectedFile.name : 'Select Video File'}
                </Button>
              </label>
            </Box>

            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <form onSubmit={handleAddTag} style={{ marginBottom: '1rem' }}>
                <TextField
                  fullWidth
                  label="Add Tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  helperText="Press Enter to add a tag"
                />
              </form>
              
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
              </Stack>
            </Box>

            {loading && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Uploading: {progress}%
                </Typography>
              </Box>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || !selectedFile}
              sx={{ 
                mt: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 1
              }}
            >
              {loading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default VideoUpload; 