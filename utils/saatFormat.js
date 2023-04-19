const moment = require('moment');



const saatFormatla = async(saat) => {

    const momentObjesi = moment({hour:saat});
    const formatliSaat = momentObjesi.format('HH:mm');

    return formatliSaat;

}


module.exports = { saatFormatla };