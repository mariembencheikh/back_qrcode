const express = require('express');
const router = express.Router();
const QRCodeMenu = require('../models/QRCodeMenu');

// Créer un qrCodeMenu
router.post('/qrcodemenu', async (req, res) => {
  try {
    const { qrCodeMenu, link, file } = req.body;
    const qrcodemenu = new QRCodeMenu({
      qrCodeMenu,
      restaurant,
      link,
      file
    });
    const result = await qrcodemenu.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir tous les qrCodeMenu
router.get('/qrcodemenu', async (req, res) => {
  try {
    const qrcodemenu = await QRCodeMenu.find();
    res.json(qrcodemenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
