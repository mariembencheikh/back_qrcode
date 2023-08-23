const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');
const multer = require('multer');
const authMiddleware = require('../midellware/auth');
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

// Configuration de multer pour enregistrer les fichiers PDF dans un dossier 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Générez un nom de fichier unique en ajoutant un timestamp au nom du fichier d'origine
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
    }
});
const upload = multer({ storage: storage });

router.post('/generate', authMiddleware,upload.single('pdfFile'), async (req, res) => {
    try {

        const { type, logo } = req.body;
        console.log(type);
        if (type !== 'menu' && type !== 'contact') {
            return res.status(400).json({ error: 'Type de QR Code non pris en charge' });
        }

        let qrCode;
        let qrCodeDataUrl = '';
        let redirectUrl='';

        if (type === 'menu') {
            if (req.file) {
                const fileURL = req.file.path; // Le chemin d'accès du fichier danst fileURL = req.file.path; // Le chemin d'accès du fichier dans
                console.log(fileURL);
                qrCode = await QRCode.create({
                    code: '',
                    type: 'menu',
                    logo: logo,
                    file: fileURL,
                    user:  req.user ,
                });
                await QRCodeMenu.create({
                    qrCode: qrCode._id,
                    restaurant: req.body.restaurant,
                    file: fileURL,
                    logo: logo
                });
             }
        } else if (type === 'contact') {
            qrCode = await QRCode.create({
                code: '',
                type: 'contact',
                logo: logo,
                file: fileURL

            });
            await QRCodeContact.create({
                qrCodeContact: qrCode._id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
            });
        }

        qrCodeDataUrl = await generateQRCode(`http://192.168.1.4:5002/api/generateqrcodes/${type}/${qrCode._id}`);
        
         redirectUrl = `http://192.168.1.4:5002/api/generateqrcodes/${type}/${qrCode._id}`;
        qrCode.code = qrCodeDataUrl;
        qrCode.link = redirectUrl;
        await qrCode.save();
        
        res.json({ qrCodeDataUrl, redirectUrl });
        console.log(redirectUrl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Endpoint pour afficher les détails du QR Code en fonction de son ID et de son type
router.get('/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const qrCode=await QRCode.findOne({_id:id})
        let typeQrCode;
        let detailsPage;
        if (type === 'menu') {
            typeQrCode = await QRCodeMenu.findOne({ qrCode: id });
            detailsPage = `<h1>Menu QR Code Details</h1>
            <p>Restaurant: ${typeQrCode.restaurant}</p>
            <p>Link: ${qrCode.link}</p>
            <p>Menu: ${typeQrCode.file}</p>`;

        } else if (type === 'contact') {
            typeQrCode = await QRCodeContact.findOne({ qrCodeContact: id });
            detailsPage = `<h1>Contact QR Code Details</h1>
            <p>First Name: ${typeQrCode.firstName}</p>
            <p>Last Name: ${typeQrCode.lastName}</p>
            <p>Email: ${typeQrCode.email}</p>
            <p>Phone Number: ${typeQrCode.phoneNumber}</p>`;
        }
        res.send(detailsPage);

        if (!typeQrCode) {
            return res.status(404).json({ error: 'QR Code introuvable' });
        }     
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;

