import axios from 'axios';

const api = axios.create({
  baseURL: 'https://video-management-application-anantadi-api.vercel.app/',  // Change to local development server
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increase timeout to 30 seconds
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url, 'with data:', config.data);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        response: {
          data: {
            message: 'The server is taking too long to respond. Please try again later.'
          }
        }
      });
    }
    
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject({
        response: {
          data: {
            message: 'Unable to connect to the server. Please check your internet connection.'
          }
        }
      });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 