const express = require('express');
const router = express.Router();
const QRCode = require('../models/QRCode');
const authMiddleware = require('../middleware/auth');
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
    res.json(qrcodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Obtenir tous les QRCodes 
router.get('/allqrcodes',async (req, res) => {
  try {
    const qrcodes = await QRCode.find();
    res.json(qrcodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Obtenir un QRCode par ID
router.get('/qrcodes/:id', async (req, res) => {
  try {
    const qrcode = await QRCode.findById(req.params.id);
    if (qrcode) {
      res.json(qrcode);
    } else {
      res.status(404).json({ message: 'QRCode not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un QRCode
router.put('/qrcodes/:id', async (req, res) => {
  try {
    const { code, type, logo, created_by } = req.body;
    const qrcode = await QRCode.findByIdAndUpdate(
      req.params.id,
      { code, type, logo, created_by },
      { new: true }
    );
    if (qrcode) {
      res.json(qrcode);
    } else {
      res.status(404).json({ message: 'QRCode not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un QRCode
router.delete('/qrcodes/:id', async (req, res) => {
  try {
    const qrcode = await QRCode.findByIdAndRemove(req.params.id);
    if (qrcode) {
      res.json({ message: 'QRCode deleted' });
    } else {
      res.status(404).json({ message: 'QRCode not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
