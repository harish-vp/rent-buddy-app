import React, { useState } from 'react';
import {
  Box,
  // Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storageService.authenticateUser(username, password)) {
      login(username, password);
      navigate('/app/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 2
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          width: '100%', 
          maxWidth: 400,
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: 3, 
          textAlign: 'center' 
        }}>
          <LockOutlined sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Rent Buddy
          </Typography>
          <Typography variant="body1">
            Property Management System
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              variant="outlined"
              autoComplete="username"
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 4, 
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Sign In
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              Default credentials: admin / admin123
            </Typography>
          </form>
        </CardContent>
      </Paper>
    </Container>
  );
};

export default LoginScreen; 