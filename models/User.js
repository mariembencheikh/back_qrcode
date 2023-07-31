const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Customer",
        required: true,
      },
   
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
