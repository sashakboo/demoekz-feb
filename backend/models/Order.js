const db = require('../config/db');

// Create table if not exists
const createTable = async () => {
  const query = `
    CREATE SEQUENCE IF NOT EXISTS order_id_seq;
    CREATE TABLE IF NOT EXISTS orders (
      id BIGINT default nextval('public.order_id_seq' :: regclass) PRIMARY KEY,
      user_id BIGINT REFERENCES users(id),
      address TEXT NOT NULL,
      contact_info TEXT NOT NULL,
      service_type VARCHAR(100) NOT NULL,
      custom_service TEXT,
      service_date DATE NOT NULL,
      service_time TIME NOT NULL,
      payment_method VARCHAR(20) NOT NULL,
      status VARCHAR(20) DEFAULT 'новая',
      admin_comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await db.query(query);
    console.log('Orders table created successfully');
  } catch (err) {
    console.error('Error creating orders table:', err);
  }
};

const createOrder = async ({ userId, address, contactInfo, serviceType, customService, serviceDate, serviceTime, paymentMethod }) => {
  const query = `
    INSERT INTO orders (user_id, address, contact_info, service_type, custom_service, service_date, service_time, payment_method)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING *
  `;
  const values = [userId, address, contactInfo, serviceType, customService, serviceDate, serviceTime, paymentMethod];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getAllOrders = async () => {
  const query = `
    SELECT o.id, o.address, o.contact_info, o.service_type, o.custom_service, o.service_date, o.service_time, 
           o.payment_method, o.status, o.admin_comment, o.created_at, u.fullname
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;
  
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const getOrdersByUserId = async (userId) => {
  const query = `
    SELECT * FROM orders 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `;
  
  try {
    const result = await db.query(query, [userId]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const updateOrderStatus = async (orderId, status, adminComment = null) => {
  let query;
  let values;
  
  if (status === 'отменено') {
    query = 'UPDATE orders SET status = $1, admin_comment = $2 WHERE id = $3 RETURNING *';
    values = [status, adminComment, orderId];
  } else {
    query = 'UPDATE orders SET status = $1, admin_comment = NULL WHERE id = $2 RETURNING *';
    values = [status, orderId];
  }
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createTable,
  createOrder,
  getAllOrders,
  getOrdersByUserId,
  updateOrderStatus
};