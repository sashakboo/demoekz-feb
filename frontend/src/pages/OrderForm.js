import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material';
import axios from 'axios';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    address: '',
    contactInfo: '',
    serviceType: '',
    customService: '',
    serviceDate: '',
    serviceTime: '',
    paymentMethod: '',
    isCustomService: false
  });
  
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Адрес обязателен';
    }
    
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Контактная информация обязательна';
    }
    
    if (!formData.serviceType && !formData.isCustomService) {
      newErrors.serviceType = 'Выберите тип услуги';
    }
    
    if (formData.isCustomService && !formData.customService.trim()) {
      newErrors.customService = 'Опишите требуемую услугу';
    }
    
    if (!formData.serviceDate) {
      newErrors.serviceDate = 'Дата обязательна';
    }
    
    if (!formData.serviceTime) {
      newErrors.serviceTime = 'Время обязательно';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Выберите способ оплаты';
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
      const token = localStorage.getItem('token');
      const serviceType = formData.isCustomService ? formData.customService : formData.serviceType;
      
      const orderData = {
        address: formData.address,
        contactInfo: formData.contactInfo,
        serviceType: serviceType,
        customService: formData.isCustomService ? formData.customService : null,
        serviceDate: formData.serviceDate,
        serviceTime: formData.serviceTime,
        paymentMethod: formData.paymentMethod
      };
      
      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSubmitSuccess(true);
      setSubmitError('');

      setFormData({
        address: '',
        contactInfo: '',
        serviceType: '',
        customService: '',
        serviceDate: '',
        serviceTime: '',
        paymentMethod: '',
        isCustomService: false
      });
    } catch (error) {
      setSubmitError('Произошла ошибка при создании заявки');
      console.error('Error creating order:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Формирование заявки
        </Typography>
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>
        )}
        
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>Заявка успешно создана!</Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Адрес"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Контактная информация"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            error={!!errors.contactInfo}
            helperText={errors.contactInfo}
            margin="normal"
            placeholder="Телефон или email"
            variant="outlined"
          />
          
          <FormControl fullWidth margin="normal" error={!!errors.serviceType} variant="outlined">
            <InputLabel>Тип услуги</InputLabel>
            <Select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              disabled={formData.isCustomService}
            >
              <MenuItem value="общий клининг">Общий клининг</MenuItem>
              <MenuItem value="генеральная уборка">Генеральная уборка</MenuItem>
              <MenuItem value="послестроительная уборка">Послестроительная уборка</MenuItem>
              <MenuItem value="химчистка ковров и мебели">Химчистка ковров и мебели</MenuItem>
            </Select>
            {errors.serviceType && <Typography color="error">{errors.serviceType}</Typography>}
          </FormControl>
          
          <FormControlLabel
            control={
              <Checkbox
                name="isCustomService"
                checked={formData.isCustomService}
                onChange={handleChange}
              />
            }
            label="Иная услуга"
          />
          
          {formData.isCustomService && (
            <TextField
              fullWidth
              label="Описание услуги"
              name="customService"
              value={formData.customService}
              onChange={handleChange}
              error={!!errors.customService}
              helperText={errors.customService}
              margin="normal"
              variant="outlined"
            />
          )}
          
          <TextField
            fullWidth
            label="Дата"
            type="date"
            name="serviceDate"
            value={formData.serviceDate}
            onChange={handleChange}
            error={!!errors.serviceDate}
            helperText={errors.serviceDate}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Время"
            type="time"
            name="serviceTime"
            value={formData.serviceTime}
            onChange={handleChange}
            error={!!errors.serviceTime}
            helperText={errors.serviceTime}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
          
          <FormControl fullWidth margin="normal" error={!!errors.paymentMethod} variant="outlined">
            <InputLabel>Способ оплаты</InputLabel>
            <Select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <MenuItem value="наличные">Наличные</MenuItem>
              <MenuItem value="банковская карта">Банковская карта</MenuItem>
            </Select>
            {errors.paymentMethod && <Typography color="error">{errors.paymentMethod}</Typography>}
          </FormControl>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button type="submit" variant="contained" color="primary" size="large">
              Отправить заявку
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default OrderForm;