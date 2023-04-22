const express = require('express');
const {verifyToken} = require('../auth/verifyToken');
const {seferleriGetir} = require('../controllers/seferController');
const {seferDetayGetir} = require('../controllers/seferController');
const {biletAl} = require('../controllers/seferController');
const {biletlerimiGetir} = require('../controllers/seferController');
const {biletlerimDetayGetir} = require('../controllers/seferController');


const router = express.Router();

router.get('/seferler/:nereden-:nereye', verifyToken, seferleriGetir);
router.get('/seferler/detay/:seferNo', verifyToken, seferDetayGetir  )

router.patch('/seferler/:seferNo/biletal', verifyToken, biletAl);
router.get('/biletlerim', verifyToken, biletlerimiGetir);
router.get('/biletlerim/detaylar', verifyToken, biletlerimDetayGetir);




module.exports = router;

///seferler/125/biletal?koltukno=32,28,29,30,31