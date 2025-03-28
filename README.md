# Video Management Application
Live Frontend Link:   https://gleeful-squirrel-b60726.netlify.app/
Backend Link:  https://video-management-gilt.vercel.app/

A full-stack video management application that allows users to upload, manage, and edit videos with features like trimming, tagging, and searching.

## Features

### Frontend
- User authentication (login/register)
- Video upload with metadata (title, description, tags)
- Video playback with ReactPlayer
- Video management (edit, delete, trim)
- Search and filter videos
- Responsive design with Material-UI
- Mock mode for testing without backend

### Backend
- RESTful API endpoints
- User authentication with JWT
- Video file handling
- Database integration
- Error handling and validation

## Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- React Router
- React Player
- Axios for API calls
- Local Storage for mock mode

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd video-management-app
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Mock Mode

The application includes a mock mode for testing without a backend connection. In mock mode:
- Videos are stored in browser's localStorage
- Video files are stored as URLs in localStorage
- All CRUD operations are simulated locally
- Authentication is handled through localStorage

To use mock mode:
1. No backend server is required
2. Start only the frontend server
3. The application will automatically use mock data

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Videos
- GET `/api/videos` - Get all videos (with pagination, search, and filters)
- GET `/api/videos/:id` - Get video details
- POST `/api/videos` - Upload new video
- PATCH `/api/videos/:id` - Update video details
- DELETE `/api/videos/:id` - Delete video

## Project Structure

```
video-management-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── context/
│   │   └── theme/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- React Player for video playback
- MongoDB for the database
- Express.js for the backend framework
