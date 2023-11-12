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
        const qrCode = await qrcode.toDataURL(link);
        console.log(qrCode);

        return qrCode;
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
       //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
       //cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
      cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });



router.post('/generate', authMiddleware,upload.fields([{ name: 'pdfFile' }, { name: 'logo' }]), async (req, res) => {
    try {

        const type = req.body.type;
        console.log("type====",type);
        if (type !== 'menu' && type !== 'contact') {
            return res.status(400).json({ error: 'Type de QR Code non pris en charge' });
        }

        let qrCode;
        let qrCodeDataUrl = '';
        let redirectUrl='';

        if (type === 'menu') {
            
                const filePath = req.files['pdfFile'][0].path; // Chemin du fichier du menu
                const logoPath = req.files['logo'][0].path; // Le chemin d'accès du fichier danst fileURL = req.file.path; // Le chemin d'accès du fichier dans
                qrCode = await QRCode.create({
                    code: '',
                    type: 'menu',
                    logo: logoPath,
                    user:  req.user ,
                });
                await QRCodeMenu.create({
                    qrCode: qrCode._id,
                    restaurant: req.body.restaurant,
                    file: filePath,
                });
            
        } else if (type === 'contact') {
            qrCode = await QRCode.create({
                code: '',
                type: 'contact',
                logo: logoPath,
                file: filePath

            });
            await QRCodeContact.create({
                qrCodeContact: qrCode._id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
            });
        }

        qrCodeDataUrl = await generateQRCode(`http://192.168.100.185:3000/api/generateqrcodes/${type}/${qrCode._id}`);
       redirectUrl = `http://192.168.100.185:3000/api/generateqrcodes/${type}/${qrCode._id}`;
       //redirectUrl = `http://192.168.100.185:3000/api/generateqrcodes/${type}/${qrCode._id}`;
        console.log(redirectUrl);
        qrCode.code = qrCodeDataUrl;
       qrCode.link = redirectUrl;
        await qrCode.save();
        
        res.json({ qrCodeDataUrl,redirectUrl });
        //console.log(redirectUrl);
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
      
        if (type === 'menu') {
            typeQrCode = await QRCodeMenu.findOne({ qrCode: id });
           

        } else if (type === 'contact') {
            typeQrCode = await QRCodeContact.findOne({ qrCodeContact: id });
           
        }
        res.send(typeQrCode);

        if (!typeQrCode) {
            return res.status(404).json({ error: 'QR Code introuvable' });
        }     
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;

