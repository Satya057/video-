import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [videoUrls, setVideoUrls] = useState({});
  const videosPerPage = 6;

  const fetchVideos = async () => {
    try {
      // In mock mode, get videos from localStorage
      const storedVideos = JSON.parse(localStorage.getItem('videos') || '[]');
      
      // Filter videos based on search and tags
      let filteredVideos = storedVideos;
      
      if (searchTitle) {
        filteredVideos = filteredVideos.filter(video =>
          video.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
          video.description.toLowerCase().includes(searchTitle.toLowerCase())
        );
      }
      
      if (selectedTag) {
        filteredVideos = filteredVideos.filter(video =>
          video.tags.includes(selectedTag)
        );
      }
      
      // Sort videos
      filteredVideos.sort((a, b) => {
        switch (sortBy) {
          case 'uploadDate':
            return new Date(b.uploadDate) - new Date(a.uploadDate);
          case 'title':
            return a.title.localeCompare(b.title);
          case 'views':
            return b.views - a.views;
          default:
            return 0;
        }
      });
      
      // Calculate pagination
      const totalVideos = filteredVideos.length;
      const calculatedTotalPages = Math.ceil(totalVideos / videosPerPage);
      const startIndex = (page - 1) * videosPerPage;
      const endIndex = startIndex + videosPerPage;
      const paginatedVideos = filteredVideos.slice(startIndex, endIndex);
      
      // Process video URLs
      const urlMap = {};
      paginatedVideos.forEach(video => {
        if (video.fileUrl.startsWith('video_')) {
          const storedUrl = localStorage.getItem(video.fileUrl);
          if (storedUrl) {
            urlMap[video.fileUrl] = storedUrl;
          }
        } else {
          urlMap[video.fileUrl] = video.fileUrl;
        }
      });
      
      setVideos(paginatedVideos);
      setVideoUrls(urlMap);
      setTotalPages(calculatedTotalPages);
      setError('');
    } catch (err) {
      setError('Failed to fetch videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, searchTitle, selectedTag, sortBy]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTitle(event.target.value);
    setPage(1);
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search videos..."
                value={searchTitle}
                onChange={handleSearchChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="uploadDate">Upload Date</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="views">Views</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={4}>
          {videos.map((video) => (
            <Grid item key={video._id} xs={12} sm={6} md={4}>
              <Card
                component={Link}
                to={`/videos/${video._id}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  {videoUrls[video.fileUrl] ? (
                    <CardMedia
                      component="video"
                      sx={{ height: 180 }}
                      image={videoUrls[video.fileUrl]}
                    />
                  ) : (
                    <Box 
                      sx={{ 
                        height: 180,
                        bgcolor: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <Typography>Video Preview Unavailable</Typography>
                    </Box>
                  )}
                  <Typography
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      px: 1,
                      borderRadius: 1,
                      fontSize: '0.875rem'
                    }}
                  >
                    {formatDuration(video.duration)}
                  </Typography>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" noWrap>
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {video.description}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {video.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedTag(tag);
                          setPage(1);
                        }}
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export default Dashboard; 