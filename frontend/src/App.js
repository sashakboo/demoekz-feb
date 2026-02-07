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

// Import images for the slider
import img1 from './assets/img/1-Skolko-stoit-klining.jpg';
import img2 from './assets/img/cleaning_company_14.jpg';
import img3 from './assets/img/kliningovye-uslugi.jpg';

const sliderImages = [img1, img2, img3];

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;