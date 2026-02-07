import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Navbar';
import Slider from './components/Slider';
import Register from './pages/Register';
import Login from './pages/Login';
import OrderForm from './pages/OrderForm';
import OrdersList from './pages/OrdersList';
import AdminPanel from './pages/AdminPanel';

import img1 from './assets/img/1.jpg';
import img2 from './assets/img/2.jpg';
import img3 from './assets/img/3.jpg';
import img4 from './assets/img/4.jpg';
import img5 from './assets/img/5.jpg';
import img6 from './assets/img/6.jpg';
import img7 from './assets/img/7.jpg';
import img8 from './assets/img/8.jpg';
import img9 from './assets/img/9.jpg';

const sliderImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9 ];

function App() {
  return (
    <Router>
      <Container maxWidth="lg" sx={{ px: 0 }}>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <Slider images={sliderImages} />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                  <OrdersList />
                </Container>
              </>
            } />
            <Route path="/register" element={
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Register />
              </Container>
            } />
            <Route path="/login" element={
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Login />
              </Container>
            } />
            <Route path="/order-form" element={
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <OrderForm />
              </Container>
            } />
            <Route path="/orders-list" element={
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <OrdersList />
              </Container>
            } />
            <Route path="/admin" element={
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <AdminPanel />
              </Container>
            } />
          </Routes>
        </div>
      </Container>
    </Router>
  );
}

export default App;