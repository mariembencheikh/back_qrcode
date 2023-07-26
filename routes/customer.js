const router = require('express').Router()
const Customer = require('../models/CustomerModel')
const bcrypt = require('bcrypt')

//post
router.post('/register', async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPass = await bcrypt.hash(req.body.password, salt)
      const newUser = new Customer({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPass,
        role:"Customer",
        phoneNumber: req.body.phoneNumber,
        country : req.body.country,
               
      })
      const user = await newUser.save()
      res.status(200).json(user)
    } catch (err) {
      res.status(500).json(err)
    }
  })

  //login
  router.post('/login', async (req, res) => {
    try {
      const user = await Customer.findOne({ email: req.body.email })
      if (!user) {
        return res.status(400).json('Wrong Password or email')
      }
      const validated = await bcrypt.compare(req.body.password, user.password)
      if (!validated) {
        return res.status(400).json('Wrong Password or Email')
      }
      const { password, ...others } = user._doc
      res.status(200).json("login success")
    } catch (err) {
      res.status(500).json(err)
    }
  })

  //Get User
    router.get('/:id', async (req, res) => {
        try {
        const user = await Customer.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others)
        } catch (err) {
        res.status(500).json("user not found")
        }
    })


    //update
    router.put('/:id', async (req, res) => {
        if (req.body._id === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        try {
            const updatedUser = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
            )
            res.status(200).json("user updated successfully")
        } catch (err) {
            res.status(500).json(err)
        }
        } else {
        res.status(401).json('You can update only your account!')
        }
    })
    
    //Delete
    router.delete('/:id', async (req, res) => {
        if (req.body._id === req.params.id) {
        try {
            const user = await Customer.findById(req.params.id)
            try {
            await Customer.findByIdAndDelete(req.params.id)
            res.status(200).json('User deleted successfully')
            } catch (err) {
            res.status(500).json(err)
            }
        } catch (err) {
            res.status(404).json('User not found!')
        }
        } else {
        res.status(401).json('You can delete only your account!')
        }
    })
  
    router.get('/logout',  function (req, res, next)  {
      // If the user is loggedin
      if (req.session.email) {
            req.session.destroy((err)=>{
              if(err){
                      console.log(err);
              }
            });
            console.log("user log out");
           // res.redirect('/');
      }
  });
  module.exports = router
