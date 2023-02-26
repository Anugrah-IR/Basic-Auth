require('dotenv').config();
const sequelize = require('../config/database');
const users = require('../models/user')
const bcrypt = require('bcrypt');

module.exports = {

    // Register
    register: async (req,res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await users.create({
                email: req.body.email,
                password: hashedPassword
            });
    
            res.status(201).send({
                "status": "success",
                "message": "Register Successfull"
            });
        }
        catch {
            res.status(500).send({
                "status": "error",
                "message": "Internal Server Error"
            });
        }
    },

    // Login
    login: async (req,res) => {
        try {
            const user = await users.findOne({ where: { email : req.body.email } });
            if (await bcrypt.compare(req.body.password, user.password)) {
                res.status(200).send({
                    "status": "success",
                    "message": "Login successfull"
                });
            }
            else {
                res.status(401).send({
                    "status": "error",
                    "Message": "Wrong Password"
                });
            }
        }
        catch {
            res.status(500).send({
                "status": "error",
                "message": "Internal Server Error"
            });
        }
    },

    // Reset password
    resetPassword: async (req,res) => {
        try {
            const user = await users.findOne({ where: { email : req.body.email } });
            if (await bcrypt.compare(req.body.oldPassword, user.password)) {
                await user.update({ password: req.body.newPassword })

                res.status(200).send({
                    "status": "success",
                    "message": "Password Successfully Changed"
                });
            }
            else {
                res.status(401).send({
                    "status": "error",
                    "Message": "Wrong Password"
                });
            }
          } catch {
                res.status(500).send({
                    "status": "error",
                    "message": "Internal Server Error"
                });
          }
    }

}