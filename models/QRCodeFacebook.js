const mongoose = require('mongoose');

const qrCodeFacebookSchema = new mongoose.Schema({
  qrCodeFacebook: { type: mongoose.Types.ObjectId, ref: 'QRCode' },
  link: String,
}, { timestamps: true });

const QRCodeFacebook = mongoose.model('QRCodeFacebook', qrCodeFacebookSchema);

module.exports = QRCodeFacebook;
