const mongoose = require('mongoose');
const qrCodeSchema = new mongoose.Schema(
    {
      code:String,
      type: String,
      logo: String,
     
      created_by: { type: mongoose.Types.ObjectId, ref: "Customer" },
    },
    { timestamps: true }
  );
  module.exports = mongoose.model('QRCode', qrCodeSchema)
