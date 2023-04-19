const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const {registerValidation} = require('../validations/registerValidation');
const {loginValidation} = require('../validations/loginValidation');
const mongoose = require('mongoose');
const { generateToken } = require('../auth/generateToken');






const register = asyncHandler(async (req, res) => {
   
    try {
        const {email, sifre,cinsiyet,telefon, isim, yas} = req.body;

        const {error} = await registerValidation(req.body)

        let hataMesaji = error?.details[0]?.message || error?.message;

        if (error) return res.status(400).json({message: hataMesaji});

        const checkUser = await User.findOne({email});

        if (checkUser) return res.status(400).json({message: 'bu email adresi kullanılıyor'});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(sifre, salt);

        const user = new User({
            isim,
            email,
            sifre: hashedPassword,
            cinsiyet,
            yas,
            telefon,
        })

       await user.save();

       const newToken = await generateToken(user);


         return res.status(201).json({
            message: 'kayıt başarılı',
            token :  newToken
        
        });

        
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({message: 'sunucuda bir hata oluştu'});

    }


});

const login = asyncHandler(async(req,res) => {

    try {
        const {email,sifre} = req.body;
        const {error} = await loginValidation(req.body);
    
        const hataMesaji = error?.details[0]?.message || error?.message;
    
        if (error) return res.status(400).json({message: hataMesaji});
    
        const user = await User.findOne({email});
    
        if (!user) return res.status(404).json({message: 'bu email adresi bulunamadı'});
    
        const checkPassword = await bcrypt.compare(sifre, user.sifre);
    
        if (!checkPassword) return res.status(400).json({message: 'lütfen şifrenizi kontrol edin'});
    
    
        const newToken = await generateToken(user);
    
    
        return res.status(200).json({
            message: 'giriş başarılı',
            token :  newToken
        })
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'sunucuda bir hata oluştu, giriş yapılamadı'});
        
    }
    




})






module.exports = {register, login
};

