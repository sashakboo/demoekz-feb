const bcrypt = require('bcryptjs');
const db = require('../config/db');

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      login VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      fullname VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await db.query(query);
    console.log('Users table created successfully');
    
    // Если админа нет, то создадим
    const adminExists = await findByLogin('adminka');
    if (!adminExists) {
      const hashedPassword = '$2a$10$KfeCScIMKQeExoNacnguDeP2rd4Q6whzVqgzV2CchidgOaKJb6r1e';
      await createUser({
        login: 'adminka',
        password: hashedPassword,
        fullname: 'Администратор',
        phone: '+7(000)-000-00-00',
        email: 'admin@cleaning-service.ru'
      });
      console.log('Admin user created successfully');
    }
  } catch (err) {
    console.error('Error creating users table:', err);
  }
};

const createUser = async ({ login, password, fullname, phone, email }) => {
  const query = 'INSERT INTO users (login, password, fullname, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [login, password, fullname, phone, email];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const findByLogin = async (login) => {
  const query = 'SELECT * FROM users WHERE login = $1';
  const result = await db.query(query, [login]);
  return result.rows[0];
};

const findById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createTable,
  createUser,
  findByLogin,
  findById
};