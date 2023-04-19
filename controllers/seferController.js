const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const Sefer = require("../models/Sefer");
const { seferValidation } = require("../validations/seferValidation");
const { saatFormatla } = require("../utils/saatFormat");

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

    
    let{seferNo} = req.params;

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
      secilenKoltuklar.push({ koltukno: koltuknoItem, cinsiyet: cinsiyetItem });
    }




    let sagTaraftakiKoltuklar = [4,3,8,7,12,11,16,15,20,19,24,23,30,29,34,33,38,37];
    let solTaraftakiKoltuklar = [1,2,6,5,10,9,14,13,18,17,22,21,26,25,28,27,32,31,36,35,40,39];
    let solumdakiKisiNo;
    let sagimdakiKisiNo;

    seferNo = Number(seferNo);
    

    console.log("koltuk no son hali : " + koltukno);


  
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

 const koltuklarDizi = await seferDizi[7].koltuklar.map((koltuk) => {

        return {
          koltukNo: koltuk.koltukNo,
          mevcutMu: koltuk.mevcutMu,
          cinsiyet: koltuk.cinsiyet,

        }
      }) 

      const koltukBul = await koltuklarDizi.find((koltuk)=> koltuk.koltukNo === koltukno)

      if (!koltukBul) return res.status(404).json({message: 'bu koltuk numarasına ait koltuk bulunamadı'});
      
      if (koltukBul.mevcutMu === false) return res.status(400).json({message: 'bu koltuk zaten dolu, lütfen başka bir koltuk seçiniz'});

      let yanimdakiKisi;

      
      if (solTaraftakiKoltuklar.includes(koltukno)) {

        if (koltukno % 2 ===1){
          secilenKoltuklar.push(koltukno);
          sagimdakiKisiNo = koltukno + 1;

          yanimdakiKisi = await koltuklarDizi.find(
            (koltuk) => koltuk.koltukNo === sagimdakiKisiNo && koltuk.mevcutMu === false
          )

          if (yanimdakiKisi?.cinsiyet !== cinsiyetim && yanimdakiKisi?.mevcutMu === false)
           return res.status(400).json({


            message: "yanınızdaki kişiyle aynı cinsiyette olmalısınız !"
          })


          if (yanimdakiKisi?.cinsiyet === cinsiyetim && yanimdakiKisi?.mevcutMu === false) {
            secilenKoltuklar.push(sagimdakiKisiNo);

          }

        }
        else if(koltukno % 2 === 0){
          secilenKoltuklar.push(koltukno);

          solumdakiKisiNo = koltukno - 1;

          yanimdakiKisi = await koltuklarDizi.find(
            (koltuk) => koltuk.koltukNo === solumdakiKisiNo && koltuk.mevcutMu === false
          )

          if (yanimdakiKisi?.cinsiyet !== cinsiyetim && yanimdakiKisi?.mevcutMu === false)
            return res.status(400).json({
              message: "yanınızdaki kişiyle aynı cinsiyette olmalısınız !"
            })

          if (yanimdakiKisi?.cinsiyet === cinsiyetim && yanimdakiKisi?.mevcutMu === false) {
            secilenKoltuklar.push(solumdakiKisiNo);
          }

    
        }

      }





      if (sagTaraftakiKoltuklar.includes(koltukno)) {


        if (koltukno % 2 ===1) {

          secilenKoltuklar.push(koltukno);
          sagimdakiKisiNo = koltukno + 1;

          yanimdakiKisi = await koltuklarDizi.find(
            (koltuk) => koltuk.koltukNo === sagimdakiKisiNo && koltuk.mevcutMu === false
          )

          if (yanimdakiKisi?.cinsiyet !== cinsiyetim && yanimdakiKisi?.mevcutMu === false)
            return res.status(400).json({
              message: "yanınızdaki kişiyle aynı cinsiyette olmalısınız !"
            })

          if (yanimdakiKisi?.cinsiyet === cinsiyetim && yanimdakiKisi?.mevcutMu === false) {
            secilenKoltuklar.push(sagimdakiKisiNo);
          }



          
        }
        else {
          secilenKoltuklar.push(koltukno);
          solumdakiKisiNo = koltukno - 1;

          yanimdakiKisi = await koltuklarDizi.find(
            (koltuk) => koltuk.koltukNo === solumdakiKisiNo && koltuk.mevcutMu === false
          )

          if (yanimdakiKisi?.cinsiyet !== cinsiyetim && yanimdakiKisi?.mevcutMu === false)
            
            return res.status(400).json({
              message: "yanınızdaki kişiyle aynı cinsiyette olmalısınız !"
            })

          if (yanimdakiKisi?.cinsiyet === cinsiyetim && yanimdakiKisi?.mevcutMu === false) {

            secilenKoltuklar.push(solumdakiKisiNo);

          }

        }

      }

    
  
    return res.status(200).json({
      message: 'bilet alındı',
      secilenKoltuk: secilenKoltuklar.length > 0 ? secilenKoltuklar : 'koltuk seçimi yapılmadı',
      sagdaki: sagimdakiKisiNo ? sagimdakiKisiNo : 'sağ tarafınızda kimse yok !',
      soldaki: solumdakiKisiNo ? solumdakiKisiNo : 'sol tarafınızda kimse yok !',
      yanimdakiKisiBilgisi: yanimdakiKisi ? yanimdakiKisi : 'yanınızda kimse yok !',
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'sunucuda bir hata oluştu' || error.message});
  }

}

);





module.exports = { seferleriGetir, seferDetayGetir, biletAl};
