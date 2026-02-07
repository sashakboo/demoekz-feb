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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [adminComment, setAdminComment] = useState('');
  const [commentRequired, setCommentRequired] = useState(false);

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

      const response = await axios.get('http://localhost:5000/api/orders', {
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

  const handleStatusChange = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setAdminComment(order.admin_comment || '');
    setCommentRequired(order.status === 'отменено');
    setOpenDialog(true);
  };

  const handleStatusUpdate = async () => {
    if (status === 'отменено' && !adminComment.trim()) {
      return; 
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/orders/${selectedOrder.id}/status`,
        { status, adminComment: status === 'отменено' ? adminComment : null },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === selectedOrder.id ? { ...order, status, admin_comment: status === 'отменено' ? adminComment : null } : order
        )
      );

      setOpenDialog(false);
      setSelectedOrder(null);
    } catch (err) {
      setError('Ошибка при обновлении статуса заявки');
      console.error(err);
    }
  };

  const handleStatusSelect = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setCommentRequired(newStatus === 'отменено');
    if (newStatus !== 'отменено') {
      setAdminComment('');
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
          Панель администратора
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}        
        
        {orders.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ py: 4 }}>
            Нет заявок для отображения
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ФИО заявителя</TableCell>
                  <TableCell>Адрес</TableCell>
                  <TableCell>Тип услуги</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Время</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.fullname}</TableCell>
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
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleStatusChange(order)}
                      >
                        Изменить статус
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog for status change */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Изменение статуса заявки</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography sx={{ mb: 2 }}>
                Заявка #{selectedOrder.id} для {selectedOrder.fullname}
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={status}
                  onChange={handleStatusSelect}
                >
                  <MenuItem value="новая">Новая</MenuItem>
                  <MenuItem value="в работе">В работе</MenuItem>
                  <MenuItem value="выполнено">Выполнено</MenuItem>
                  <MenuItem value="отменено">Отменено</MenuItem>
                </Select>
              </FormControl>
              
              {commentRequired && (
                <TextField
                  autoFocus
                  margin="dense"
                  label="Причина отмены"
                  fullWidth
                  multiline
                  rows={3}
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  required
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleStatusUpdate} 
            disabled={commentRequired && !adminComment.trim()}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;