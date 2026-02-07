import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.login.trim()) {
      newErrors.login = 'Логин обязателен';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        const isAdmin = response.data.user.login === 'adminka';
        localStorage.setItem('isAdmin', isAdmin.toString());
        
        setSubmitError('');
        window.location.href = '/';
      }
    } catch (error) {
      if (error.response && error.response.data.msg) {
        setSubmitError(error.response.data.msg);
      } else {
        setSubmitError('Произошла ошибка при входе');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Вход
        </Typography>
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Логин"
            name="login"
            value={formData.login}
            onChange={handleChange}
            error={!!errors.login}
            helperText={errors.login}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            variant="outlined"
          />
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button type="submit" variant="contained" color="primary" size="large">
              Войти
            </Button>
            
            <Box sx={{ mt: 2 }}>
              <Typography>
                Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
              </Typography>
              
              <Typography variant="body2" sx={{ mt: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                Для тестирования админ-панели используйте:<br/>
                Логин: <strong>adminka</strong><br/>
                Пароль: <strong>cleanservic</strong>
              </Typography>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;