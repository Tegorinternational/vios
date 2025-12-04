// models/user.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'newpassword',
  database: 'bloggy_db'
  
});

async function createUser(username, passwordHash) {
  const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, passwordHash]);
  return result.insertId;
}

async function findUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

module.exports = { createUser, findUserByUsername };
