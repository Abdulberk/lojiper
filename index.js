const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const {connectDB} = require('./connection');
const userRoutes = require('./routes/userRoutes');
const seferRoutes = require('./routes/seferRoutes');
require('events').EventEmitter.defaultMaxListeners = 15;
const seferOlustur = require('./data/testData');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

connectDB()
  .then(() => {


    seferOlustur();
    
    app.use('/', userRoutes);
    app.use('/', seferRoutes);
    


    app.get('/', (req,res)=> {
        return res.status(200).send('Hello World');
    })

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('bağlantı başarısız !', err);
  });







