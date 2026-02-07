const { Pool } = require('pg');

const dbhost = process.env.DB_HOST || 'localhost';
const pool = new Pool({
  user: process.env.DB_USER || 'mveu',
  host: process.env.DB_HOST || 'university-cluster-7388.8nj.cockroachlabs.cloud',
  database: process.env.DB_NAME || 'demoekz',
  password: process.env.DB_PASSWORD || 'k-XCXn-XUY1_yyg7SSn_8A',
  port: process.env.DB_PORT || 26257,
  ssl: true
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};