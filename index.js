const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const app = express()
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5002');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cors());
app.use(express.json())
//pour afficher l'image en front
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json());
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const qrcodes = require('./routes/qrcode')
const qrcodeMenu = require('./routes/qrcoemenu')
const generatorRouter = require('./controllers/generatorQRCode') 
app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/qrcodes', qrcodes)
app.use('/api/qrcodeMenu', qrcodeMenu)
app.use('/api/generateqrcodes', generatorRouter);
app.use((req, res, next) => {
  // Simulating user authentication for testing purposes
  req.user = { _id: 'user_id' };
  next();
  
});





mongoose.connect("mongodb+srv://mariembencheikh71:qrcode@cluster0.k305xuq.mongodb.net/qrcode",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('connected'))
  .catch(err => console.log(err))

app.listen('5002', () => {
  console.log('running...')
})