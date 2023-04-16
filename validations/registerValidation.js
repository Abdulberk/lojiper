const Joi = require('joi');

const registerValidation = async(data) => {

    const registerSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(32).required(),
        gender: Joi.string().required(),
        age: Joi.number().required(),
        phone: Joi.number().required(),
    });

    return  registerSchema.validateAsync(data);


}

module.exports = {registerValidation};