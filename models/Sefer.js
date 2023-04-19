const mongoose = require('mongoose');

const seferSchema = new mongoose.Schema({
    seferNo : {
        type: Number,
        required: true

    }
    ,
    isim : {
        type: String,
        required: true

    },
    nereden: [
        {
            sehirIsmi : {
                type: String,
                required: true
            }
            ,
            sehirKod : {
                type: Number,
                required: true
            },

        }
    ],

    nereye: [
        {
            sehirIsmi : {
                type: String,
                required: true
            },
            sehirKod : {
                type: Number,
                required: true
            },

        }
    ],
    seferSaati : {
        type: Number,
        required: true,
        max: 23,
        min: 0
    },

    biletFiyat : {
        type: Number,
        required: true
    },

    koltuklar : [
        {
            koltukNo: {
                type: Number,
                required: true
            },
            mevcutMu: {
                type: Boolean,
                required: true
            },
            cinsiyet: {
                type: String,
               

            }


            }

    ],

    toplamKoltukSayisi : {
        type: Number,
        required: true
        
    },
    bosKoltukSayisi : {
        type: Number,
        required: true

    },

    doluKoltukSayisi : {
        type: Number,
        required: true
    },

})


const Sefer = mongoose.model('Sefer', seferSchema);

module.exports = Sefer;