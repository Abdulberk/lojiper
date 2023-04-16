const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        
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

    password : {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        maxlength: 32,
    
    },

    gender: {
        type: String,
        required: true,
        
    },

    age: {
        type: Number,
        required: true,
    },

    phone: {
        type: Number,
        required: true,
    },


})



const User = mongoose.model('User', userSchema);
module.exports = User;
