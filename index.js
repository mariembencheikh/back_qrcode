const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())
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