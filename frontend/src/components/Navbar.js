import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Портал клининговых услуг «Мой Не Сам»
        </Typography>
        
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