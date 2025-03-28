const port = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// For Vercel serverless deployment
module.exports = app;

mongoose.connect(process.env.MONGODB_DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Add error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Example of proper async route handling
app.post('/your-route', async (req, res, next) => {
  try {
    // Your async operations here
    const result = await someAsyncOperation();
    res.json(result);
  } catch (error) {
    next(error); // Pass errors to error handling middleware
  }
}); 