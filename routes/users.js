const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const authMiddleware = require('../midellware/auth');


//post
router.post('/addAdmin', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)
    const newUser = new User({
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
//UPDATE

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your account!");
    }
  });
  
  //Delete
  router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        try {
          await User.findByIdAndDelete(req.params.id);
          res.status(200).json("User has been deleted..");
        } catch (err) {
          res.status(500).json(err);
        }
      } catch (err) {
        res.status(404).json("User not found!");
      }
    } else {
      res.status(401).json("You can delete only your account!");
    }
  });
  
  //post customer
router.post('/addCustomer', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)
    const newUser = new User({
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
  // Get customers by role
  router.get('/all', authMiddleware, async (req, res) => {
    try {
      
      const customers = await User.find({
        role: "Customer",
      }).select('-password');
  
      res.status(200).json(customers);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  
  router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
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
module.exports = router;
