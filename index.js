const express = require("express")
const Sequelize = require("sequelize")
const bcrypt = require("bcrypt")
const app = express()
const port = 3000
app.use(express.json())


// connect to database
const sequelize = new Sequelize("test", "root", "12345678", {
  dialect: "mysql"
})

// create a table for users
const User = sequelize.define("User", {
  email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  }
})
sequelize.sync({ force: true });


// register
app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({
          email: req.body.email,
          password: hashedPassword
         })

        res.status(200).send({
            "status": "success",
            "message": "Register successfull"
        })
    } catch {
        res.status(500).send({
            "status": "error",
            "message": "Register failed"
        })
    }
})


// login 
app.post("/login", async (req, res) => {

  try {
    const user = await User.findOne({ where: { email : req.body.email } })
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).send({
        "status": "success",
        "message": "Login successfull"
      })
    }
    else {
      res.status(403).send({
        "status": "error",
        "Message": "Wrong password"
      })
    }
  } catch {
    res.status(403).send({
      "status": "error",
      "message": "Server error"
    })
  }
  
})


// update password
app.post("/updatePassword", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email : req.body.email } })
    if (await bcrypt.compare(req.body.oldPassword, user.password)) {
      user.password = req.body.newPassword
      await user.save()

      res.status(200).send({
      "status": "success",
      "message": "Password successfully changed"
      })
    }
    else {
      res.status(403).send({
        "status": "error",
        "Message": "Wrong old password"
      })
    }
  } catch {
    res.status(403).send({
      "status": "error",
      "message": "Server error"
    })
  }
  
})


app.listen(port)