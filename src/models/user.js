const sequelize = require('../config/database');
const DataTypes = require('sequelize');

// Define a table for 'user'
const users = sequelize.define("users", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = users;