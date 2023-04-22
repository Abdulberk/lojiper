const { connectDB} = require("../connection");
const Sefer = require("../models/Sefer");
const mongoose = require("mongoose");
const User = require("../models/User");


const rezervasyonYap = async (alinacakKoltuklar, seferNo, userId) => {
  try {
    await connectDB();
    let koltukNoDizi = alinacakKoltuklar.map((koltuk) => koltuk.koltukNo);
    let cinsiyetDizi = alinacakKoltuklar.map((koltuk) => koltuk.cinsiyet);

    let sonuclar = [];

    for (let i = 0; i < koltukNoDizi.length; i++) {
      let sonuc = await Sefer.updateOne(
        {
          seferNo: seferNo,
          "koltuklar.koltukNo": koltukNoDizi[i],
        },
        {
          $set: {
            "koltuklar.$.cinsiyet": cinsiyetDizi[i],
            "koltuklar.$.mevcutMu": false,
            "koltuklar.$.sahibi": new mongoose.Types.ObjectId(userId),


          },
          $inc: {
            bosKoltukSayisi: -1,
            doluKoltukSayisi: 1,
          },
        }
      );

      sonuclar.push(sonuc);
    }

    let basariliSayisi = sonuclar.filter(
      (sonuc) => sonuc.modifiedCount > 0
    ).length;

    if (basariliSayisi > 0) {
      console.log("tebrikler", sonuclar);
      return basariliSayisi;
    }
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};


const buSeferdenDahaOnceBiletAlindiMi = async (userId, sefer) => {
  try {
    const seferSorgula = await Sefer.findOne({
      seferNo: sefer.seferNo,
      "koltuklar.sahibi": userId,
    });

    if (seferSorgula) {
      return true
    }
  
    return false;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};



const biletlerimAlaniniGuncelle = async(id, sefer) => {
    try {

        const user = await User.findByIdAndUpdate({_id: id},
            {
                $push: {
                    seferler: new mongoose.Types.ObjectId(sefer._id),

            }
        }
            
            )

            if (user) {
                console.log("kullanıcı biletlerim alanı güncellendi");
                
            }

        

    }
    catch(error) {
        console.log(error.message);
        throw error;
    }


}

module.exports = { rezervasyonYap, biletlerimAlaniniGuncelle, buSeferdenDahaOnceBiletAlindiMi };
