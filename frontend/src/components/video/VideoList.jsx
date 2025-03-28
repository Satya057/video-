import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  Stack,
  IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const videosPerPage = 8;

  // Simulated video data (replace with actual API call)
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulated video data
        const mockVideos = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          title: `Video ${i + 1}`,
          description: `Description for video ${i + 1}`,
          thumbnail: 'https://via.placeholder.com/320x180',
          duration: '3:45',
          uploadDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          views: Math.floor(Math.random() * 1000),
          tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1)
        }));

        setVideos(mockVideos);
        setFilteredVideos(mockVideos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filter and sort videos
  useEffect(() => {
    let result = [...videos];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      result = result.filter(video =>
        selectedTags.every(tag => video.tags.includes(tag))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

    setFilteredVideos(result);
    setPage(1); // Reset to first page when filters change
  }, [videos, searchTerm, sortBy, selectedTags]);

  // Get current page's videos
  const getCurrentVideos = () => {
    const startIndex = (page - 1) * videosPerPage;
    return filteredVideos.slice(startIndex, startIndex + videosPerPage);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTagClick = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'white', pt: 4, pb: 6 }}>
      <Container maxWidth="lg">
        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="date">Upload Date</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="views">Views</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Tag filters */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {Array.from(new Set(videos.flatMap(video => video.tags))).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagClick(tag)}
                color={selectedTags.includes(tag) ? "primary" : "default"}
              />
            ))}
          </Stack>
        </Box>

        {/* Videos grid */}
        <Grid container spacing={3}>
          {getCurrentVideos().map((video) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                    transition: 'all 0.3s ease'
                  }
                }}
                onClick={() => navigate(`/video/${video.id}`)}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={video.thumbnail}
                  alt={video.title}
                />
                <Box 
                  sx={{ 
                    position: 'absolute',
                    bottom: 175,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    px: 1,
                    borderRadius: 1,
                    fontSize: '0.875rem'
                  }}
                >
                  {video.duration}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {formatDate(video.uploadDate)}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                    {video.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagClick(tag);
                        }}
                        color={selectedTags.includes(tag) ? "primary" : "default"}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(filteredVideos.length / videosPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default VideoList; 