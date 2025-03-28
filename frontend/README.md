# Video Management Application

A full-stack video management application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to upload, view, and manage their video collections.

## Features

- User Authentication (Login, Signup, Forgot Password)
- Video Upload with Progress Tracking
- Video Playback
- Video Management (Filtering, Sorting, Pagination)
- Tag-based Organization
- Responsive Design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB
- Backend server running on http://localhost:8000

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ForgotPassword.jsx
│   ├── video/
│   │   ├── VideoUpload.jsx
│   │   ├── VideoList.jsx
│   │   └── VideoPlayer.jsx
│   └── layout/
│       └── Navbar.jsx
├── context/
│   └── AuthContext.jsx
└── App.jsx
```

## Technologies Used

- React
- Material-UI
- React Router
- Axios
- React Player

## API Endpoints

The application uses the following backend endpoints:

- POST /login - User login
- POST /signup - User registration
- POST /forget-pass - Request password reset
- POST /reset-password - Reset password
- GET /videos - Get video list
- POST /upload - Upload video
- GET /video/:id - Get video details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
