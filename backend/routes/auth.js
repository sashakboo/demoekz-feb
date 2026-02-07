const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// POST api/auth/register
// Регистрация пользователя
router.post('/register', [
  body('login')
    .isLength({ min: 1 })
    .withMessage('Логин обязателен'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Пароль должен содержать не менее 8 символов'),
  body('fullname')
    .matches(/^[а-яёА-ЯЁ\s]+$/)
    .withMessage('ФИО должно содержать только кириллические символы и пробелы'),
  body('email')
    .isEmail()
    .withMessage('Введите действительный адрес электронной почты')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { login, password, fullname, phone, email } = req.body;
    const existingUser = await User.findByLogin(login);
    if (existingUser) {
      return res.status(400).json({ msg: 'Пользователь с таким логином уже существует' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.createUser({
      login,
      password: hashedPassword,
      fullname,
      phone,
      email
    });

    const payload = { userId: newUser.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || '1', { expiresIn: '1h' });

    res.json({ token, user: { id: newUser.id, login: newUser.login, fullname: newUser.fullname } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST api/auth/login
// Логин пользователя
router.post('/login', [
  body('login')
    .exists()
    .withMessage('Логин обязателен'),
  body('password')
    .exists()
    .withMessage('Пароль обязателен')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { login, password } = req.body;
    const user = await User.findByLogin(login);
    if (!user) {
      return res.status(400).json({ msg: 'Логин не существует' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Неверный пароль' });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || '1', { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, login: user.login, fullname: user.fullname } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;