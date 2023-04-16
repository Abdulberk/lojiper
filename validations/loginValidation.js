const Joi = require('joi');

const loginValidation = async(data) => {

    const loginSchema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(32).required(),
    });

    return loginSchema.validateAsync(data);


}

module.exports = {loginValidation};

