import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Alert
} from '@mui/material';
import axios from 'axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходимо войти в систему');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/orders/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке заявок');
      setLoading(false);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" align="center">Загрузка...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Мои заявки
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        
        <Box sx={{ mb: 2, textAlign: 'right' }}>
          <Button variant="contained" color="primary" href="/order-form">
            Новая заявка
          </Button>
        </Box>
        
        {orders.length === 0 ? (
          <Typography variant="body1" align="center">
            У вас пока нет заявок
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Адрес</TableCell>
                  <TableCell>Тип услуги</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Время</TableCell>
                  <TableCell>Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>{order.service_type || order.custom_service}</TableCell>
                    <TableCell>{new Date(order.service_date).toLocaleDateString()}</TableCell>
                    <TableCell>{order.service_time}</TableCell>
                    <TableCell>
                      <Box 
                        sx={{ 
                          display: 'inline-block', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          backgroundColor: 
                            order.status === 'новая' ? '#e3f2fd' :
                            order.status === 'в работе' ? '#fff8e1' :
                            order.status === 'выполнено' ? '#e8f5e9' :
                            '#ffebee',
                          color: 
                            order.status === 'новая' ? '#1976d2' :
                            order.status === 'в работе' ? '#f57f17' :
                            order.status === 'выполнено' ? '#388e3c' :
                            '#d32f2f'
                        }}
                      >
                        {order.status}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default OrdersList;