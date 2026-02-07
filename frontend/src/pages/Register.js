import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    fullname: '',
    phone: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
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
    
    if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать не менее 8 символов';
    }
    
    if (!/^[а-яёА-ЯЁ\s]+$/.test(formData.fullname)) {
      newErrors.fullname = 'ФИО должно содержать только кириллические символы и пробелы';
    }
    
    // if (!/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(formData.phone)) {
    //   newErrors.phone = 'Неверный формат телефона. Используйте +7(XXX)-XXX-XX-XX';
    // }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите действительный адрес электронной почты';
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
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSuccess(true);
        setSubmitError('');
        
        // Redirect after successful registration
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data.msg) {
        setSubmitError(error.response.data.msg);
      } else if (error.response && error.response.data.errors) {
        const errorMessages = {};
        error.response.data.errors.forEach(err => {
          errorMessages[err.param] = err.msg;
        });
        setErrors(errorMessages);
      } else {
        setSubmitError('Произошла ошибка при регистрации');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Регистрация
        </Typography>
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>Регистрация успешна! Перенаправление...</Alert>
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
          
          <TextField
            fullWidth
            label="ФИО"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            error={!!errors.fullname}
            helperText={errors.fullname}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Телефон"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="normal"
            placeholder="+7(XXX)-XXX-XX-XX"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            variant="outlined"
          />
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button type="submit" variant="contained" color="primary" size="large">
              Зарегистрироваться
            </Button>
            
            <Box sx={{ mt: 2 }}>
              <Typography>
                Есть аккаунт? <a href="/login">Войти</a>
              </Typography>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;