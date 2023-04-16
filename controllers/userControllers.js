const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const {registerValidation} = require('../validations/registerValidation');
const {loginValidation} = require('../validations/loginValidation');
const mongoose = require('mongoose');





const register = asyncHandler(async (req, res) => {
   
    try {
        const {email, password,gender,phone, name, age} = req.body;

        const {error} = await registerValidation(req.body)

        const hataMesaji = error.details[0].message;

        if (error) return res.status(400).json({message: hataMesaji});

        const checkUser = await User.findOne({email});

        if (checkUser) return res.status(400).json({message: 'bu email adresi kullanılıyor'});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            gender,
            age,
            phone,
        })

       await user.save();

         return res.status(200).json({message: 'kayıt başarılı'});

        
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({message: 'sunucuda bir hata oluştu'});

    }


});

const login = asyncHandler(async(req,res) => {

    const {email,password} = req.body;
    const {error} = await loginValidation(req.body);

    const hataMesaji = error.details[0].message;

    if (error) return res.status(400).json({message: hataMesaji});

    
    


})






module.exports = {register};

