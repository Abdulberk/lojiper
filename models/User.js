const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    isim: {
        
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,

    },

    email : {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 255,
        unique: true,
    },

    sifre : {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
      
    },

    cinsiyet: {
        type: String,
        required: true,
        enum: ['Erkek', 'Kadın'],
        
    },

    yas: {
        type: Number,
        required: true,
    },

    telefon: {
        type: Number,
        required: true,
    },


})



const User = mongoose.model('User', userSchema);
module.exports = User;
