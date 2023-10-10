const express = require('express');
const router = express.Router();
const QRCode = require('../models/QRCode');
const QRCodeMenu = require('../models/QRCodeMenu');
const authMiddleware = require('../midellware/auth');
// Créer un QRCode
router.post('/add', authMiddleware,async (req, res) => {
  try {
    const { code, type, logo,user, created_by } = req.body;
    const qrcode = new QRCode({
     
      code,
      type,
      logo,
      user,
      created_by
    });
    const result = await qrcode.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});

// Obtenir tous les QRCodes by user
router.get('/qrcodes', authMiddleware,async (req, res) => {
  try {
    const qrcodes = await QRCode.find({user: req.user});
    const qrcodeDetails = await Promise.all(qrcodes.map(async (qrcode) => {
      const qrcodeMenu = await QRCodeMenu.findOne({ qrCode: qrcode._id });
      return { qrcode, qrcodeMenu };
    }));
    res.json(qrcodeDetails);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Obtenir tous les QRCodes 
router.get('/allqrcodes',async (req, res) => {
  try {
    const qrcodes = await QRCode.find();
    const qrcodeDetails = await Promise.all(qrcodes.map(async (qrcode) => {
      const qrcodeMenu = await QRCodeMenu.findOne({ qrCode: qrcode._id });
      return { qrcode, qrcodeMenu };
    }));
    res.json(qrcodeDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Obtenir un QRCode par ID
router.get('/qrcodes/:id', authMiddleware,async (req, res) => {
  try {
    const qrcodeId = req.params.id;

    const qrcode = await QRCode.findOne({_id: qrcodeId, user: req.user});
    if (!qrcode) {
      res.status(404).json({ message: 'QRCode not found' });
    } 
    // Recherchez le QRCodeMenu associé s'il existe
    const qrcodeMenu = await QRCodeMenu.findOne({ qrCode: qrcode._id });

    // Retournez les détails du QR code et du menu QRCodeMenu
    res.json({ qrcode, qrcodeMenu });
  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un QRCode
router.put('/qrcodes/:id' , authMiddleware, async (req, res) => {
  try {
    const qrcodeId = req.params.id;
    const updatedData = req.body;
    const updatedQRCode  = await QRCode.findByIdAndUpdate(
      { _id: qrcodeId, user: req.user },
      updatedData.qrcode,
      { new: true }
    );
    const existingMenu = await QRCodeMenu.findOne({ qrCode: qrcodeId });

    if (existingMenu) {
      // Update the QRCodeMenu if it exists
      await QRCodeMenu.findOneAndUpdate(
        { qrCode: qrcodeId },
        updatedData.qrcodeMenu, // Updated QRCodeMenu data
        { new: true }
      );
    }
    
  res.json(updatedQRCode);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un QRCode
router.delete('/qrcodes/:id', async (req, res) => {
  const qrcodeId = req.params.id;

  try {
    const qrcode = await QRCode.findById(qrcodeId);
    const qrcodeMenu = await QRCodeMenu.findOne({ qrCode: qrcodeId });
    console.log(qrcodeMenu);
    if (qrcodeMenu) {
      // Supprimez le QRCodeMenu associé s'il existe
      await QRCodeMenu.findByIdAndDelete(qrcodeMenu._id);
    }
    await QRCode.findByIdAndDelete(qrcodeId);

    res.json({ message: 'QR code et QRCodeMenu associé supprimés avec succès' });
    console.log('QR code et QRCodeMenu associé supprimés avec succès' );
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
