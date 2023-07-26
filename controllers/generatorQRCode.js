const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');

const QRCode = require('../models/QRCode');
const QRCodeContact = require('../models/QRCodeContact');
const QRCodeMenu = require('../models/QRCodeMenu');

async function generateQRCode(link) {
    try {
        const qrCodeDataUrl = await qrcode.toDataURL(link);
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la génération du code QR :', error);
        throw error;
    }
}

router.post('/generate', async (req, res) => {
    try {
        const { type, link, file, logo } = req.body;
        if (type !== 'menu' && type !== 'contact') {
            return res.status(400).json({ error: 'Type de QR Code non pris en charge' });
        }

        let qrCode;
        let qrCodeDataUrl='';

        if (type === 'menu') {
            qrCode = await QRCode.create({
                code: '', 
                type: 'menu',
                logo: logo,
                file:file 

            });
            await QRCodeMenu.create({
                qrCodeMenu: qrCode._id,
                restaurant:req.body.restaurant,
                link,
                file: file,
                logo:logo 
            });
        } else if (type === 'contact') {
            qrCode = await QRCode.create({
                code: '', 
                type: 'contact',
                logo: logo,
                file:file 

            });
            await QRCodeContact.create({
                qrCodeContact: qrCode._id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
            });

        }
        qrCodeDataUrl = await generateQRCode(`http://192.168.1.9:5002/api/qrcodes/redirect/${type}/${qrCode._id}`);
        qrCode.code=qrCodeDataUrl;
        await qrCode.save();
        const redirectUrl = `http://192.168.1.9:5002/api/qrcodes/redirect/${type}/${qrCode._id}`;
        res.json({ qrCodeDataUrl, redirectUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Endpoint pour afficher les détails du QR Code en fonction de son ID et de son type
router.get('/redirect/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;

        let qrCode;
        if (type === 'menu') {
            qrCode = await QRCodeMenu.findOne({ qrCodeMenu: id });
        } else if (type === 'contact') {
            qrCode = await QRCodeContact.findOne({ qrCodeContact: id });
        }

        if (!qrCode) {
            return res.status(404).json({ error: 'QR Code introuvable' });
        }

        let detailsPage;
        if (type === 'menu') {
            detailsPage = `<h1>Menu QR Code Details</h1>
        <p>Restaurant: ${qrCode.restaurant}</p>
        <p>Link: ${qrCode.link}</p>
        <p>File: ${qrCode.file}</p>`;
        } else if (type === 'contact') {
            detailsPage = `<h1>Contact QR Code Details</h1>
        <p>First Name: ${qrCode.firstName}</p>
        <p>Last Name: ${qrCode.lastName}</p>
        <p>Email: ${qrCode.email}</p>
        <p>Phone Number: ${qrCode.phoneNumber}</p>`;
        }

        res.send(detailsPage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;

