const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

router.post('/register', async (request, response) => {
  const { userEmail, userPassword, displayName } = request.body;
  const hashedPass = await bcrypt.hash(userPassword, 10);

  database.run(
    `INSERT INTO users (email, password, username) VALUES (?, ?, ?)`,
    [userEmail, hashedPass, displayName],
    (error) => {
      if (error) {
        return response.status(400).json({ error: 'Email already registered' });
      }
      const userData = { userId: this.lastID, email: userEmail };
      const authToken = jwt.sign(userData, jwtSecret, { expiresIn: '24h' });
      response.status(201).json({ authToken });
    }
  );
});

router.post('/login', (request, response) => {
  const { userEmail, userPassword } = request.body;
  database.get(
    `SELECT * FROM users WHERE email = ?`,
    [userEmail],
    async (error, userRecord) => {
      if (!userRecord || !(await bcrypt.compare(userPassword, userRecord.password))) {
        return response.status(401).json({ error: 'Invalid credentials' });
      }
      const authToken = jwt.sign({ userId: userRecord.id }, jwtSecret, { expiresIn: '24h' });
      response.json({ authToken });
    }
  );
});

module.exports = router;