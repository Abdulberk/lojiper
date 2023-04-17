const express = require('express');
const { verifyToken } = require('../auth/verifyToken');
const {register, login} = require('../controllers/userControllers');
const User = require('../models/User');




const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', verifyToken, 
    async(req,res) => {

        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({message: 'kullanıcı bulunamadı'});

        return res.status(200).json({
            message: 'token doğrulandı',
            user: user.name
        })


    }
)







module.exports = router;

