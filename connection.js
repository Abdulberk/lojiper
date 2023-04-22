const mongoose = require('mongoose');

const connection = {
  isConnected: false
};

const connectDB = async () =>{
  if (connection.isConnected) {
    console.log('veritabanına zaten bağlandı !');
    return;
  }

  try {
    const baglanti = process.env.MONGODB_URI;
    const db = await mongoose.connect(baglanti);

    console.log('yeni bağlantı kuruldu !');

    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.error('bağlantı başarısız !', err);
  }
}

const disconnect = async () => {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    }
    if (process.env.NODE_ENV === 'development') {
        await mongoose.disconnect();
        connection.isConnected = false;

    }

  }

}

module.exports = { connectDB, disconnect };

