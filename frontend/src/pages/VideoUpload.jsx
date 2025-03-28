import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Chip,
  Stack,
  LinearProgress,
} from '@mui/material';
import Navbar from '../components/Navbar';

const VideoUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setError('');
      // Auto-generate title from filename if title is empty
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, ''); // Remove extension
        setTitle(fileName);
      }
    } else {
      setFile(null);
      setError('Please select a valid video file');
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const processVideoFile = (file) => {
    return new Promise((resolve) => {
      // Create an HTML5 video element to get duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      // Create a permanent URL for the video
      const fileUrl = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        
        // Store the video in localStorage for testing purposes
        // In a real app, you would upload to a server
        const timestamp = new Date().getTime();
        const videoKey = `video_${timestamp}`;
        localStorage.setItem(videoKey, fileUrl);
        
        resolve({
          fileUrl: videoKey, // Store a key instead of the direct URL
          duration
        });
      };
      
      video.onerror = () => {
        // If there's an error loading the video metadata, provide default values
        resolve({
          fileUrl: URL.createObjectURL(file),
          duration: 0
        });
      };
      
      video.src = fileUrl;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      setUploadProgress(10);
      
      // Process the video file
      const { fileUrl, duration } = await processVideoFile(file);
      
      setUploadProgress(50);
      
      // Create video data
      const videoData = {
        title,
        description,
        tags,
        fileUrl,
        fileSize: file.size,
        fileType: file.type,
        duration,
        uploadDate: new Date().toISOString(),
        views: 0
      };

      // In mock mode, we'll store the video data in localStorage
      const videosInStorage = JSON.parse(localStorage.getItem('videos') || '[]');
      const newVideo = {
        _id: `video_${Date.now()}`,
        ...videoData
      };
      videosInStorage.push(newVideo);
      localStorage.setItem('videos', JSON.stringify(videosInStorage));
      
      setUploadProgress(100);

      // Redirect after a small delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload video');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              Upload Video
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 2, mb: 2 }}
              >
                Select Video File
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>

              {file && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Selected file: {file.name}
                </Typography>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Box sx={{ mt: 2, mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    size="small"
                    label="Add tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button variant="outlined" onClick={handleAddTag}>
                    Add
                  </Button>
                </Stack>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                    />
                  ))}
                </Box>
              </Box>

              {uploadProgress > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" align="right">
                    {uploadProgress}%
                  </Typography>
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Uploading...' : 'Upload Video'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default VideoUpload; 