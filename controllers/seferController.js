const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const Sefer = require("../models/Sefer");
const { seferValidation } = require("../validations/seferValidation");
const { saatFormatla } = require("../utils/saatFormat");

const {rezervasyonYap} = require('../utils/rezervasyonYap');

const {biletlerimAlaniniGuncelle} = require('../utils/rezervasyonYap');

const {buSeferdenDahaOnceBiletAlindiMi} = require('../utils/rezervasyonYap');


const biletlerimDetayGetir = asyncHandler(async (req, res) => {


  try {


    const {id} = req.user;

    const biletlerimiGetir = await User.findById({_id:id}).populate('seferler')

    if(!biletlerimiGetir) return res.status(404).json({message: 'Hiç bilet almadınız !'});


    const seferlerim = biletlerimiGetir.seferler;

    const butunDetaylar = seferlerim.map((sefer) => {
      return {
        seferNo: sefer.seferNo,
        seferSaat: sefer.seferSaati,
        biletFiyat: sefer.biletFiyat,
        kalkisYeri: sefer.nereden,
        varisYeri: sefer.nereye,
        koltuklar: sefer.koltuklar
          .filter((koltuk) => koltuk.sahibi == id)
          .map((koltuk) =>
            {
              return {
                koltukNo: koltuk.koltukNo,
                cinsiyet: koltuk.cinsiyet

              }
            }
          ),
      };
    });

    return res.status(200).json({
      butunDetaylar
    })
  

  }catch(err) {
    console.log(err);
    return res.status(500).json({message: 'sunucuda bir hata oluştu'});

  }




});




const biletlerimiGetir = asyncHandler(async (req, res) => {

  try {


    const {id} = req.user;

    const biletlerimiGetir = await User.findById({_id:id}).populate('seferler')

    if(!biletlerimiGetir) return res.status(404).json({message: 'Hiç bilet almadınız !'});


    const seferlerim = biletlerimiGetir.seferler;

    const seferlerimdekiKoltuklar = seferlerim.map((sefer) => {
      return {
        seferNo: sefer.seferNo,
        koltuklar: sefer.koltuklar
          .filter((koltuk) => koltuk.sahibi == id)
          .map((koltuk) => koltuk.koltukNo),
      };
    });

    return res.status(200).json({
      biletlerim: seferlerimdekiKoltuklar


    })
  

  }catch(err) {
    console.log(err);
    return res.status(500).json({message: 'sunucuda bir hata oluştu'});

  }

});



const seferleriGetir = asyncHandler(async (req, res) => {
  try {
    let { nereden, nereye } = req.params;

    nereden = nereden.charAt(0).toUpperCase() + nereden.slice(1);
    nereye = nereye.charAt(0).toUpperCase() + nereye.slice(1);

    const seferler = await Sefer.find({
      $and: [{ "nereden.sehirIsmi": nereden }, { "nereye.sehirIsmi": nereye }],
    });

    if (seferler.length === 0)
      return res.status(404).json({ message: "sefer bulunamadı" });

    const formatliSaat = await saatFormatla(seferler[0].seferSaati);

    return res.status(200).json({
      seferler: seferler.map((sefer) => {
        return {
          seferSaati: formatliSaat,
          nereden: sefer.nereden[0].sehirIsmi,
          nereye: sefer.nereye[0].sehirIsmi,
          biletFiyati: sefer.biletFiyat,
        };
      }),
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "sunucuda bir hata oluştu" || err.message });
  }
});


const seferDetayGetir = asyncHandler(async (req, res) => {


try {
    
        let {seferNo} = req.params;
        
        const sefer = await Sefer.findOne({seferNo
        })

        console.log(sefer)
        
        if(!sefer) return res.status(404).json({message: 'sefer bulunamadı'});
    
        const formatliSaat = await saatFormatla(sefer.seferSaati);
      
        return res.status(200).json({
            seferSaati: formatliSaat,
            nereden: `${sefer.nereden[0].sehirIsmi}(${sefer.nereden[0].sehirKod}) `,
            nereye: `${sefer.nereye[0].sehirIsmi}(${sefer.nereye[0].sehirKod}) `,
            biletFiyati: sefer.biletFiyat,
            toplamKoltukSayisi: sefer.toplamKoltukSayisi,
            bosKoltukSayisi: sefer.bosKoltukSayisi,
            doluKoltukSayisi: sefer.doluKoltukSayisi,
            seferNo: sefer.seferNo,
            koltuklar: sefer.koltuklar.map(
                (koltuk) => {

                    return {
                        koltukNo: koltuk.koltukNo,
                        mevcutMu: koltuk.mevcutMu,
                        cinsiyet: koltuk.cinsiyet,
                    } 
                    
                }
            )
        });
    
       
    
} catch (error) {
    console.log(error);
    return res.status(500).json({message: 'sunucuda bir hata oluştu' || error.message});
    
}

});


const biletAl = asyncHandler(async (req, res) => { 
  
  try {
    let userId = req.user.id;


    let seferNo = req.params.seferNo
    seferNo = Number(seferNo);

   let koltukno = req.query.koltukno || [];

   let cinsiyetler = req.query.cinsiyetler || [];
  let secilenKoltuklar = [];

   if (typeof koltukno === 'string'){
    koltukno = koltukno.split(',').map((koltuk) => Number(koltuk.trim()));
   }

    if (typeof cinsiyetler === 'string'){
      cinsiyetler = cinsiyetler.split(',').map((cinsiyet) => cinsiyet.trim());
    }
  
  if (koltukno.length>5 || cinsiyetler.length > 5) return res.status(400).json({message: 'en fazla 5 koltuk seçebilirsiniz'});

    if (koltukno.length !== cinsiyetler.length) return res.status(400).json({message: 'koltuk sayısı ile cinsiyet sayısı eşleşmiyor'});


    for (let i = 0; i < koltukno.length; i++) {
      const koltuknoItem = Number(koltukno[i]);
      const cinsiyetItem = cinsiyetler[i];

      secilenKoltuklar.push({ koltukno: koltuknoItem, cinsiyet: cinsiyetItem
       });
    }

  

    let sagTaraftakiKoltuklar = [4,3,8,7,12,11,16,15,20,19,24,23,30,29,34,33,38,37];
    let solTaraftakiKoltuklar = [1,2,6,5,10,9,14,13,18,17,22,21,26,25,28,27,32,31,36,35,40,39];

    if (!koltukno) return res.status(400).json({message: 'lütfen önce koltuk seçiniz !'});
    if (!seferNo) return res.status(400).json({message: 'lütfen sefer numarasını giriniz !'});
  
      const seferSorgu = await Sefer.findOne({ seferNo: seferNo})

      if (!seferSorgu) return res.status(404).json({message: 'bu sefer numarasına ait sefer bulunamadı'});
  
      const seferObje = await Object.values(seferSorgu)[2];

      const values = await Object.values(seferObje);
      const keys = await Object.keys(seferObje);

      const seferDizi = await values.map((value, index) => {
        return {
          [keys[index]]: value
        }
      })

      const KOLTUKLAR_INDEX = 7;
      const koltuklarDizi = await seferDizi[KOLTUKLAR_INDEX].koltuklar.map((koltuk) => {
        return {koltukNo: koltuk.koltukNo, mevcutMu: koltuk.mevcutMu, cinsiyet: koltuk.cinsiyet,}
      }) 

      

      let koltukHataListesi = [];
      let alinacakKoltuklar = [];

      for (let i = 0; i < secilenKoltuklar.length; i++) {
        const secilenKoltuk = secilenKoltuklar[i];
       
        const koltukSorgula = await koltuklarDizi.find(
          (koltuk) => koltuk.koltukNo === secilenKoltuk.koltukno
        );
      
        if (!koltukSorgula) {
          koltukHataListesi.push({
            message: `${secilenKoltuk.koltukno} numaralı koltuk bulunamadı`,
          });
        }
        if (koltukSorgula && koltukSorgula.mevcutMu === false) {
          koltukHataListesi.push({
            message: `${secilenKoltuk.koltukno} numaralı koltuk dolu`,
          });
        }

       if (koltukSorgula?.mevcutMu) {
        alinacakKoltuklar.push({
          koltukNo: koltukSorgula.koltukNo,
          cinsiyet: secilenKoltuk.cinsiyet,
        
        })
       }
      }

      if (alinacakKoltuklar.length > 0) {
        for (let i = 0; i < alinacakKoltuklar.length; i++) {
          const alinacakKoltuk = alinacakKoltuklar[i];
          if (solTaraftakiKoltuklar.includes(alinacakKoltuk.koltukNo)) {
            if (alinacakKoltuk.koltukNo % 2 === 1) {
              const yanKoltukSorgula = await koltuklarDizi.find(
                (koltuk) => koltuk.koltukNo === alinacakKoltuk.koltukNo + 1
              
              );
             

              if (yanKoltukSorgula.mevcutMu === false) {

                if (yanKoltukSorgula.cinsiyet !== alinacakKoltuk.cinsiyet) {

                  koltukHataListesi.push({
                    message: `${alinacakKoltuk.koltukNo} numaralı koltuğun yanında ${yanKoltukSorgula.cinsiyet} cinsiyetli bir kişi var ve seçtiğiniz koltuk ${alinacakKoltuk.cinsiyet} cinsiyetli bir koltuk!`,
                  });

                  alinacakKoltuklar.splice(i, 1); 
                  

                } 
              } 

            }
            if (alinacakKoltuk.koltukNo % 2 === 0) {
              const yanKoltukSorgula = await koltuklarDizi.find(
                (koltuk) => koltuk.koltukNo === alinacakKoltuk.koltukNo - 1

              )
             

              if (yanKoltukSorgula.mevcutMu === false) {

                if (yanKoltukSorgula.cinsiyet !==  alinacakKoltuk.cinsiyet) {

                  koltukHataListesi.push({
                    message: `${alinacakKoltuk.koltukNo} numaralı koltuğun yanında ${yanKoltukSorgula.cinsiyet} cinsiyetli bir kişi var ve seçtiğiniz koltuk ${alinacakKoltuk.cinsiyet} cinsiyetli bir koltuk!`,
                  });

                  alinacakKoltuklar.splice(i, 1); 
                 
                }
              }

            }
          }
          if (sagTaraftakiKoltuklar.includes(alinacakKoltuk.koltukNo)) {
            if (alinacakKoltuk.koltukNo % 2 === 1) {
              const yanKoltukSorgula = await koltuklarDizi.find(
                (koltuk) => koltuk.koltukNo === alinacakKoltuk.koltukNo + 1

              )
             

              if (yanKoltukSorgula.mevcutMu === false) {

                if (yanKoltukSorgula.cinsiyet !== alinacakKoltuk.cinsiyet) {

                  koltukHataListesi.push({
                    message: `${alinacakKoltuk.koltukNo} numaralı koltuğun yanında ${yanKoltukSorgula.cinsiyet} cinsiyetli bir kişi var ve seçtiğiniz koltuk ${alinacakKoltuk.cinsiyet} cinsiyetli bir koltuk!`,
                  });

                  alinacakKoltuklar.splice(i, 1);

                 
                  
                }
              }
            }

            if (alinacakKoltuk.koltukNo % 2 === 0) {
              const yanKoltukSorgula = await koltuklarDizi.find((koltuk) => koltuk.koltukNo === alinacakKoltuk.koltukNo - 1)
             
              if (yanKoltukSorgula.mevcutMu === false) {
                if (yanKoltukSorgula.cinsiyet !== alinacakKoltuk.cinsiyet) {

                  koltukHataListesi.push({ message:`${alinacakKoltuk.koltukNo} numaralı koltuğun yanında ${yanKoltukSorgula.cinsiyet} cinsiyetli bir kişi var ve seçtiğiniz koltuk ${alinacakKoltuk.cinsiyet} cinsiyetli bir koltuk!`,});

                  alinacakKoltuklar.splice(i, 1);
                 
          }
        }
      }
    }
        }
      }

      let statusCode = null;
      if (koltukHataListesi.length > 0) {

        statusCode = 400;
        return res.status(statusCode).json({ koltukHataListesi, alinacakKoltuklar });

      }
      if (koltukHataListesi.length === 0) {
       

        const dahaOnceBiletAlindiMi = await buSeferdenDahaOnceBiletAlindiMi(userId, seferSorgu);

        if (dahaOnceBiletAlindiMi===true) {

          statusCode = 400;
          return res.status(statusCode).json({ message: 'Bu seferden daha önce zaten bilet almışsınız !' });

        }

        if (dahaOnceBiletAlindiMi===false) {

          const rezervasyonSonuc = await rezervasyonYap(alinacakKoltuklar, seferNo, userId);

        await biletlerimAlaniniGuncelle(userId, seferSorgu)
        

        if (rezervasyonSonuc) {
          statusCode = 200;
          return res.status(statusCode).json({ message: 'Rezervasyon başarılı', rezervasyonSonuc });
        }

        if (!rezervasyonSonuc) {
          statusCode = 500;
          return res.status(statusCode).json({ message: 'Rezervasyon başarısız' });
        }



      }
    }

     

  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'sunucuda bir hata oluştu' || error.message});
  }

}

);





module.exports = { seferleriGetir, seferDetayGetir, biletAl, biletlerimiGetir, biletlerimDetayGetir};
