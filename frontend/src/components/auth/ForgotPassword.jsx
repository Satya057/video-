import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';

const ForgotPassword = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccess('OTP has been sent to your email');
        setShowOtpForm(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword({
        email,
        otp,
        newPassword,
        confirmNewPassword: confirmNewPassword
      });
      if (result.success) {
        setSuccess('Password has been reset successfully');
        // Clear all fields
        setOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An error occurred while resetting your password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'white',
        pt: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 2, sm: 4 },
            width: '100%',
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              mb: 4,
              fontWeight: 'bold',
              color: '#1976d2'
            }}
          >
            {showOtpForm ? 'Reset Password' : 'Forgot Password'}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          {!showOtpForm ? (
            <form onSubmit={handleForgotPassword}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 1, fontSize: '1.1rem' }
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 1
                }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <TextField
                fullWidth
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 1, fontSize: '1.1rem' }
                }}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: 1, fontSize: '1.1rem' }
                }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 1, fontSize: '1.1rem' }
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 1
                }}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link 
              to="/login" 
              style={{ 
                textDecoration: 'none',
                color: '#1976d2',
                fontWeight: 'bold'
              }}
            >
              <Typography>Back to Login</Typography>
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword; 