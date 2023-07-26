const router = require('express').Router()
const Admin = require('../models/AdminModel')
const bcrypt = require('bcrypt')

//post
router.post('/addAdmin', async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPass = await bcrypt.hash(req.body.password, salt)
      const newUser = new Admin({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPass,
        role:"Admin",
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
      const user = await Admin.findOne({ email: req.body.email })
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

  //Get admin
    router.get('/:id', async (req, res) => {
        try {
        const user = await Admin.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others)
        } catch (err) {
        res.status(500).json("user not found")
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
