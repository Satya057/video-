const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authRouter = require('./routers/auth.router')
const videoRouter = require('./routers/videoRoutes')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.MONGODB_DATABASE_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
  res.send('Welcome to Video Management API')
})
app.use('/auth', authRouter);
app.use('/api/videos', videoRouter);

app.listen(PORT,()=>{
    console.log("Server is running on PORT: ",PORT)
})

module.exports = app;