const express = require('express');
const { verifyToken } = require('../auth/verifyToken');
const {register, login} = require('../controllers/userControllers');
const User = require('../models/User');




const router = express.Router();

router.post('/register', register);
router.post('/login', login);




module.exports = router;

