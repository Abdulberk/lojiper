const Sefer = require("../models/Sefer");

const seferData = [
  {
    seferNo: 123,
    isim: "Istanbul-Ankara Seferi",
    nereden: [
      {
        sehirIsmi: "Istanbul",
        sehirKod: 34,
      },
    ],
    nereye: [
      {
        sehirIsmi: "Ankara",
        sehirKod: 6,
      },
    ],
    seferSaati: 15,
    biletFiyat: 100,
    koltuklar: [
      {
        koltukNo: 1,
        mevcutMu: true,
        cinsiyet: "Erkek",
      },
      {
        koltukNo: 2,
        mevcutMu: false,
        cinsiyet: "Erkek",
      },
      {
        koltukNo: 3,
        mevcutMu: true,
        cinsiyet: "Kadın",
      },
    ],
    toplamKoltukSayisi: 40,
  },
  {
    seferNo: 124,
    isim: "Izmir-Ankara Seferi",
    nereden: [
      {
        sehirIsmi: "Izmir",
        sehirKod: 35,
      },
    ],
    nereye: [
      {
        sehirIsmi: "Ankara",
        sehirKod: 6,
      },
    ],
    seferSaati: 12,
    biletFiyat: 150,
    koltuklar: [
      {
        koltukNo: 1,
        mevcutMu: true,
        cinsiyet: "Erkek",
      },
      {
        koltukNo: 2,
        mevcutMu: true,
        cinsiyet: "Kadın",
      },
      {
        koltukNo: 3,
        mevcutMu: true,
        cinsiyet: "Erkek",
      },
    ],
    toplamKoltukSayisi: 40,
  },
  {
    seferNo: 125,
    isim: "Istanbul-Ankara Seferi",
    nereden: [
      {
        sehirIsmi: "Istanbul",
        sehirKod: 34,
      },
    ],
    nereye: [
      {
        sehirIsmi: "Ankara",
        sehirKod: 35,
      },
    ],
    seferSaati: 12,
    biletFiyat: 450,
    koltuklar: [
      {
        koltukNo: 1,
        mevcutMu: true,
        cinsiyet: "Erkek",
      },
      {
        koltukNo: 2,
        mevcutMu: true,
        cinsiyet: "Kadın",
      },
      {
        koltukNo: 3,
        mevcutMu: true,
        cinsiyet: "Erkek",
      },
    ],
    toplamKoltukSayisi: 40,
  },
];


const koltukOlustur = async (sayi) => {
  try {

    const koltuklar = [];
    let mevcutMu, cinsiyet;

    for (let i = 1; i <= sayi; i++) {
      
        mevcutMu = Math.random() < 0.5 ? true : false;

      if (mevcutMu===false) {
        cinsiyet = Math.random() < 0.5 ?  "Erkek" : "Kadın";
      }
      else {
        cinsiyet = null
      }

      koltuklar.push({
        koltukNo: i,
        mevcutMu: mevcutMu,
        cinsiyet: cinsiyet,
      });

    }

    return koltuklar;
  } catch (error) {
    console.log(error.message);
  }
};

const seferOlustur = async () => {
  try {
    await Sefer.deleteMany({});

    console.log("önceki seferler silindi, tekrar oluşturuluyor...");

    await Promise.all(
      seferData.map(async (sefer) => {
        const koltuklar = await koltukOlustur(sefer.toplamKoltukSayisi);
        const bosKoltukSayisi = koltuklar.filter(
          (koltuk) => !koltuk.mevcutMu
        ).length;
        const doluKoltukSayisi = sefer.toplamKoltukSayisi - bosKoltukSayisi;

        await Sefer.create({
          ...sefer,
          koltuklar,
          bosKoltukSayisi,
          doluKoltukSayisi,
        });
      })
    ).then(() => console.log("seferler oluşturuldu"))
        .catch((error) => console.log(error.message));
        
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = seferOlustur;
