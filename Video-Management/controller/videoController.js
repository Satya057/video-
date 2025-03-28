const Video = require('../models/Video');

// Upload a new video
const uploadVideo = async (req, res) => {
  try {
    const { title, description, tags, fileUrl, fileSize, duration } = req.body;
    
    const video = new Video({
      title,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      fileUrl,
      fileSize,
      duration,
      userId: req.user._id
    });

    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all videos for the logged-in user with filtering and pagination
const getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 10, title, tag, sortBy = 'createdAt' } = req.query;
    const query = { userId: req.user._id };

    // Apply filters
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const videos = await Video.find(query)
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Video.countDocuments(query);

    res.json({
      videos,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single video by ID
const getVideo = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a video
const updateVideo = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'tags'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const video = await Video.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    updates.forEach(update => {
      if (update === 'tags' && typeof req.body.tags === 'string') {
        video[update] = req.body.tags.split(',').map(tag => tag.trim());
      } else {
        video[update] = req.body[update];
      }
    });

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a video
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo
}; 