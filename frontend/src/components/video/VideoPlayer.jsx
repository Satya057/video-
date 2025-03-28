import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://video-management-coral.vercel.app/video/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setVideo(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch video details');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!video) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Video not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 3 }}>
            <ReactPlayer
              url={video.url}
              controls
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </Box>

          <Typography variant="h4" gutterBottom>
            {video.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {video.tags.map((tag) => (
              <Chip key={tag} label={tag} />
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" paragraph>
            {video.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
            <Typography variant="body2">
              Uploaded on: {new Date(video.uploadDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">
              Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </Typography>
            <Typography variant="body2">
              Views: {video.views}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VideoPlayer; 