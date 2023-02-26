require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/database');
const port = process.env.PORT;
const app = express();
app.use(express.json());

// Synchronize user databases
// Replace with 'sequelize.sync({ force: true })' to delete all existing users
sequelize.sync();

// Auth route
const auth = require('./src/routers/auth');
app.use('/api/auth', auth);

app.listen(port);