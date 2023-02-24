const express = require("express")
const Sequelize = require("sequelize")
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
    type: Sequelize.DataTypes.STRING
  },
  password: {
    type: Sequelize.DataTypes.STRING
  }
})
sequelize.sync({ force: true });


// register
app.post("/register", async (req, res) => {
    try {
        const user = await User.create({
          email: req.body.email,
          password: req.body.password
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

  const user = await User.findOne({ where: { email : req.body.email } })
  if (user.password === req.body.password) {
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
  
})


// update password
app.post("/updatePassword", async (req, res) => {

  const user = await User.findOne({ where: { email : req.body.email } })
  if (user.password === req.body.oldPassword) {
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
  
})



app.listen(port)