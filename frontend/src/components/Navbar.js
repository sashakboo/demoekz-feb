import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.jpg';

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    window.location.href = '/login';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Avatar 
            src={logo} 
            alt="Logo" 
            variant="square"
            sx={{ width: 40, height: 40, mr: 1, objectFit: 'cover' }} 
          />
          <Typography variant="h6" component="div">
            «Мой Не Сам»
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box>
          {!isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/login">Вход</Button>
              <Button color="inherit" component={Link} to="/register">Регистрация</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">Главная</Button>
              <Button color="inherit" component={Link} to="/order-form">Новая заявка</Button>
              {isAdmin && (
                <Button color="inherit" component={Link} to="/admin">Админ-панель</Button>
              )}
              <Button color="inherit" onClick={handleLogout}>Выход</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;