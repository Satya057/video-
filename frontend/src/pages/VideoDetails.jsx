import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import api from '../api/axios';
import {
  Container,
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
  Slider,
  Grid,
  IconButton,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  ContentCut as CutIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Navbar from '../components/Navbar';

const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cutDialogOpen, setCutDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedTags, setEditedTags] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [trimRange, setTrimRange] = useState([0, 0]);
  const [isTrimming, setIsTrimming] = useState(false);
  const playerRef = useRef(null);

  const fetchVideo = async () => {
    try {
      // In mock mode, get video from localStorage
      const videos = JSON.parse(localStorage.getItem('videos') || '[]');
      const foundVideo = videos.find(v => v._id === id);
      
      if (!foundVideo) {
        setError('Video not found');
        setVideo(null);
        return;
      }
      
      setVideo(foundVideo);
      
      // Get video URL from localStorage
      if (foundVideo.fileUrl.startsWith('video_')) {
        const storedUrl = localStorage.getItem(foundVideo.fileUrl);
        if (storedUrl) {
          setVideoUrl(storedUrl);
        } else {
          setError('Video file not found. It may have expired.');
        }
      } else {
        setVideoUrl(foundVideo.fileUrl);
      }
      
      setEditedTitle(foundVideo.title);
      setEditedDescription(foundVideo.description);
      setEditedTags(foundVideo.tags);
      setError('');
    } catch (err) {
      setError('Failed to fetch video details');
      setVideo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const handleRefreshVideo = () => {
    setLoading(true);
    fetchVideo();
  };

  const handleEdit = async () => {
    try {
      // In mock mode, update video in localStorage
      const videos = JSON.parse(localStorage.getItem('videos') || '[]');
      const videoIndex = videos.findIndex(v => v._id === id);
      
      if (videoIndex === -1) {
        throw new Error('Video not found');
      }
      
      videos[videoIndex] = {
        ...videos[videoIndex],
        title: editedTitle,
        description: editedDescription,
        tags: editedTags,
      };
      
      localStorage.setItem('videos', JSON.stringify(videos));
      setEditDialogOpen(false);
      fetchVideo();
    } catch (err) {
      setError('Failed to update video');
    }
  };

  const handleDelete = async () => {
    try {
      // In mock mode, delete video from localStorage
      const videos = JSON.parse(localStorage.getItem('videos') || '[]');
      const updatedVideos = videos.filter(v => v._id !== id);
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
      
      // Clean up video file
      if (video.fileUrl.startsWith('video_')) {
        localStorage.removeItem(video.fileUrl);
      }
      
      navigate('/');
    } catch (err) {
      setError('Failed to delete video');
      setDeleteDialogOpen(false);
    }
  };

  const handleDuration = (duration) => {
    setVideoDuration(duration);
    setTrimRange([0, duration]);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleOpenTrimDialog = () => {
    if (playerRef.current) {
      setCutDialogOpen(true);
    }
  };

  const handleTrimChange = (event, newValue) => {
    setTrimRange(newValue);
  };

  const handleTrimVideo = async () => {
    try {
      setIsTrimming(true);
      
      // In mock mode, create a new trimmed video
      const videos = JSON.parse(localStorage.getItem('videos') || '[]');
      const videoIndex = videos.findIndex(v => v._id === id);
      
      if (videoIndex === -1) {
        throw new Error('Video not found');
      }
      
      const trimmedVideo = {
        ...videos[videoIndex],
        _id: `video_${Date.now()}`,
        title: `${videos[videoIndex].title} (Trimmed)`,
        description: `${videos[videoIndex].description}\nTrimmed from ${formatTime(trimRange[0])} to ${formatTime(trimRange[1])}`,
        duration: trimRange[1] - trimRange[0],
        uploadDate: new Date().toISOString(),
      };
      
      videos.push(trimmedVideo);
      localStorage.setItem('videos', JSON.stringify(videos));
      
      setCutDialogOpen(false);
      setIsTrimming(false);
      navigate(`/videos/${trimmedVideo._id}`);
    } catch (err) {
      setError('Failed to trim video');
      setIsTrimming(false);
    }
  };

  const seekToStart = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(trimRange[0], 'seconds');
    }
  };

  const previewTrim = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(trimRange[0], 'seconds');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography>Loading...</Typography>
          </Box>
        </Container>
      </>
    );
  }

  if (!video) {
    return (
      <>
        <Navbar />
        <Container>
          <Alert severity="error" sx={{ mt: 4 }}>
            {error || 'Video not found'}
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>

        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            {videoUrl ? (
              <Box sx={{ 
                position: 'relative',
                paddingTop: '56.25%', /* 16:9 Aspect Ratio */
                width: '100%',
                backgroundColor: '#000'
              }}>
                <ReactPlayer 
                  ref={playerRef}
                  url={videoUrl}
                  controls
                  width="100%"
                  height="100%"
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                  onDuration={handleDuration}
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload',
                      },
                      forceVideo: true,
                    },
                  }}
                />
              </Box>
            ) : (
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '50vh', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'black',
                  color: 'white',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Typography variant="h6">Video not available</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<RefreshIcon />}
                  onClick={handleRefreshVideo}
                >
                  Refresh Video
                </Button>
              </Box>
            )}
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h4" component="h1">
              {video.title}
            </Typography>
            <Box>
              <Button
                startIcon={<CutIcon />}
                onClick={handleOpenTrimDialog}
                sx={{ mr: 1 }}
                disabled={!videoUrl}
              >
                Cut Video
              </Button>
              <Button
                startIcon={<EditIcon />}
                onClick={() => setEditDialogOpen(true)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </Box>
          </Stack>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {video.description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            {video.tags.map((tag) => (
              <Chip key={tag} label={tag} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary">
            Uploaded on: {new Date(video.uploadDate).toLocaleDateString()}
          </Typography>
        </Paper>

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Video</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              label="Title"
              fullWidth
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <TextField
              margin="normal"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            <TextField
              margin="normal"
              label="Tags (comma-separated)"
              fullWidth
              value={editedTags.join(', ')}
              onChange={(e) => setEditedTags(e.target.value.split(',').map(tag => tag.trim()))}
              helperText="Enter tags separated by commas"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Video</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this video? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Cut Video Dialog */}
        <Dialog
          open={cutDialogOpen}
          onClose={() => setCutDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Cut Video</DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <Typography gutterBottom>
                Drag the slider to set the start and end points of the video you want to keep.
              </Typography>
              
              <Box sx={{ mt: 4, mb: 2 }}>
                <Slider
                  value={trimRange}
                  onChange={handleTrimChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatTime}
                  min={0}
                  max={videoDuration}
                  step={0.1}
                />
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    value={formatTime(trimRange[0])}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="End Time"
                    value={formatTime(trimRange[1])}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
              
              <Button 
                variant="outlined" 
                onClick={previewTrim} 
                sx={{ mr: 2 }}
              >
                Preview Trim
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCutDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleTrimVideo}
              variant="contained"
              disabled={isTrimming}
            >
              {isTrimming ? 'Trimming...' : 'Trim Video'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default VideoDetails; 