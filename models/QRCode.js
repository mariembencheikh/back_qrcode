const mongoose = require('mongoose');
const qrCodeSchema = new mongoose.Schema(
    {
      code:String,
      type: String,
      logo: String,
      link:String,
      user: {
        type: mongoose.Types.ObjectId,
        ref:'User',
      },
      
      
      
    },
    { timestamps: true }
  );
  module.exports = mongoose.model('QRCode', qrCodeSchema)
