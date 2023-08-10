const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


router.post("/register", async (req, res) => {
  const email = req.body.email;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }else{
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
  
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPass,
        phoneNumber: req.body.phoneNumber,
        country: req.body.country,
        role: "Customer",
      });
      const user = await newUser.save();
      res.status(200).json({ message: 'User registered successfully' });  
    }
    
  } catch (err) {
    console.log(err);
    res.status(500).json(err);

  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Wrong Password or email" });
    }
    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) {
      return res.status(400).json({ message: "Wrong Password or Email" });
    }

    const token = jwt.sign({ userId: user._id }, 'secret_key');
    console.log("token: ", token);
    res.status(200).json({ user, token });

  } catch (err) {
    res.status(500).json({error: err});
  }
});


module.exports = router;
