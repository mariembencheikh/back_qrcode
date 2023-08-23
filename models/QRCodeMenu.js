const mongoose = require('mongoose')

const qrCodeMenuSchema = new mongoose.Schema(
    {
      qrCode: { type: mongoose.Types.ObjectId, ref: "QRCode" },
      restaurant:String,
      file:String,
    },
    { timestamps: true },
  );
  
  module.exports = mongoose.model('QRCodemenu', qrCodeMenuSchema)
