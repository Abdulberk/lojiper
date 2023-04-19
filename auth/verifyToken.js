const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


const verifyToken = asyncHandler(async (req, res, next) => {

    
    try {
        const token = req?.header('Authorization')?.split(' ')[1];

        
        if (!token) return res.status(401).json({message: 'token bulunamadı'});

        jwt.verify(token, process.env.JWT_SECRET,
            (error, decodedUser) => {

                if (error)
                    throw error;

                req.user = decodedUser;

                next();
            }
        );
 


    }
    catch (err) {

        switch(err)
        {
            case err instanceof jwt.TokenExpiredError:
                return res.status(401).json({message: 'tokenin süresi dolmuş !'});
            case err instanceof jwt.JsonWebTokenError:
                return res.status(403).json({message: 'token geçersiz !'});
            default:
                return res.status(500).json({message: err.message || 'token doğrulanırken bilinmeyen bir hata oluştu !'
                });

                    


    }
    }


});

module.exports = { verifyToken };