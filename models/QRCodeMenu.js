const mongoose = require('mongoose')

const qrCodeMenuSchema = new mongoose.Schema(
    {
      qrCodeMenu: { type: mongoose.Types.ObjectId, ref: "QRCode" },
      restaurant:String,
      link:String,
      file:String,
    },
    { timestamps: true },
  );
  
  module.exports = mongoose.model('QRCodemenu', qrCodeMenuSchema)