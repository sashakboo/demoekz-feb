const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// POST api/orders
// Создать новый заказ
router.post('/', [
  auth,
  body('address')
    .notEmpty()
    .withMessage('Адрес обязателен'),
  body('contactInfo')
    .notEmpty()
    .withMessage('Контактная информация обязательна'),
  body('serviceDate')
    .isISO8601()
    .withMessage('Дата должна быть в формате YYYY-MM-DD'),
  body('serviceTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Время должно быть в формате HH:MM'),
  body('paymentMethod')
    .isIn(['наличные', 'банковская карта'])
    .withMessage('Неверный способ оплаты')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { address, contactInfo, serviceType, customService, serviceDate, serviceTime, paymentMethod } = req.body;
    const userId = req.userId;

    const newOrder = await Order.createOrder({
      userId,
      address,
      contactInfo,
      serviceType,
      customService,
      serviceDate,
      serviceTime,
      paymentMethod
    });

    res.json(newOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET api/orders
// Получить все заявки для Админ-панели
router.get('/', [adminAuth], async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET api/orders/my
// Получить заявки текущего пользователя
router.get('/my', [auth], async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.getOrdersByUserId(userId);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT api/orders/:id/status
// Обновить статус заявки в админ-панели
router.put('/:id/status', [adminAuth], async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    
    if (!['новая', 'в работе', 'выполнено', 'отменено'].includes(status)) {
      return res.status(400).json({ msg: 'Неверный статус' });
    }

    if (status === 'отменено' && !adminComment) {
      return res.status(400).json({ msg: 'При отмене заявки необходимо указать причину' });
    }

    const order = await Order.updateOrderStatus(req.params.id, status, adminComment);
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;