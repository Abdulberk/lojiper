const Joi = require('joi');


const seferValidation = async(data) => {

    const seferSchema = Joi.object({
        seferNo: Joi.number().required(),
        isim: Joi.string().required(),
        nereden: Joi.array().items(
          Joi.object({
            sehirIsmi: Joi.string().required(),
            sehirKod: Joi.number().required(),
          })
        ).required(),
        nereye: Joi.array().items(
          Joi.object({
            sehirIsmi: Joi.string().required(),
            sehirKod: Joi.number().required(),
          })
        ).required(),
        seferSaati: Joi.number().required(),
        biletFiyat: Joi.number().required(),
        koltuklar: Joi.array().items(
          Joi.object({
            koltukNo: Joi.number().required(),
            mevcutMu: Joi.boolean().required(),
            cinsiyet: Joi.string().required(),
          })
        ).required(),
        toplamKoltukSayisi: Joi.number().required(),
        bosKoltukSayisi: Joi.number().required(),
        doluKoltukSayisi: Joi.number().required(),
        
      });

    return seferSchema.validateAsync(data);
}

module.exports = {seferValidation};