const mongoose = require('mongoose');

const qrCodeContactSchema = new mongoose.Schema({
  qrCodeContact: { type: mongoose.Types.ObjectId, ref: 'QRCode' },
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
}, { timestamps: true });

const QRCodeContact = mongoose.model('QRCodeContact', qrCodeContactSchema);

module.exports = QRCodeContact