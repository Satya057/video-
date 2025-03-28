const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  uploadVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo
} = require('../controller/videoController');

// All routes require authentication
router.use(auth);

// Video routes
router.post('/', uploadVideo);
router.get('/', getVideos);
router.get('/:id', getVideo);
router.patch('/:id', updateVideo);
router.delete('/:id', deleteVideo);

module.exports = router; 