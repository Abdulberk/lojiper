const Joi = require('joi');

const registerValidation = async(data) => {

    const registerSchema = Joi.object({
        isim: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(6).max(255).required().email(),
        sifre: Joi.string().min(6).max(32).required(),
        cinsiyet: Joi.string().required(),
        yas: Joi.number().required(),
        telefon: Joi.number().required(),
    });

    return  registerSchema.validateAsync(data);

    

}

module.exports = {registerValidation};