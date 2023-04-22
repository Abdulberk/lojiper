# Kurulum

MongoDB'de cluster oluşturarak veritabanını yapılandırın. Cluster'ın ismi **"lojiCluster"** olmalı. Farklı bir isim verecekseniz **.env** dosyasında **MONGODB_URI** değişkeninde ilgili yeri de ona uygun olarak güncelleyin, varsayılan olarak benim veritabanımdaki cluster kullanılacak. **Username** ve **password** bilgilerini de aynı şekilde kendi oluşturduğunuz veritabanı bilgilerinizle .env dosyasında **@** ile ayrılan bölüme sırayla girerek güncelleyebilirsiniz. Projeyi kendi workspace'nize klonladıktan ve veritabanı konfigürasyonundan emin olduktan sonra **"npm run start"** veya **"npm run dev"** komutlarıyla projeyi localde ayağa kaldırabilirsiniz.

# Özellikler

- **5 adede** kadar koltuk alabilirsiniz.
- Almak istediğiniz her koltuğun cinsiyetini belirtmelisiniz, aksi takdirde hata mesajı alırsınız.
- Almak istediğiniz koltuk doluysa hata mesajı alırsınız.
- Veritabanından gelen kalkış saati otomatik olarak formatlanır
- Rezervasyon işlemi tamamlandıktan sonra aynı otobüsten tekrar koltuk almak isterseniz hata mesajı alırsınız. 
- **JWT** token sistemiyle **authorization** özelliği implemente edildi, böylece sadece yetkiniz olan endpointlere istek atabilir ve işlem yapabilirsiniz. Tokenler **30 gün** geçerlidir, süresi bittiğinde hata mesajı döner.
- Test verileri proje ayağa kalktığı anda her seferinde **OTOMATİK** olarak **rastgele** belirli yoğunlukta oluşturulur, herhangi bir kayıt eklemekle uğraşmazsınız.
-Farklı cinsiyette bir yolcunun yanından koltuk almaya çalışırsanız hata mesajı alırsınız.
-Sadece tüm seçimleriniz hatasız olduğunda rezervasyon işlemi yapılır (örn: 10,15,20 numaralı koltukları seçtiniz ve bunlardan herhangi biri bile şartları sağlamazsa rezervasyon yapılamaz ve o koltukla ilgili hata mesajı response olarak döner).
- Otobüsteki koltuk/yolcu sayısının sınırı olacağı için **bilet** için veritabanında model oluşturulmadı, ancak **kullanıcı** ve **sefer** sayıları sınırsız olabileceği için olası performans kayıpları düşünülerek her biri için model oluşturuldu.

# Endpointler

##### /seferler/:nereden-:nereye #####

 Kalkış ve varış noktasını şehir ismi olarak belirtip **GET** metoduyla istek attığınızda sefer varsa seferleri getirir.
 **Örnek:** `/seferler/istanbul-ankara`

##### /seferler/detay/:seferNo #####

sefer numarasını girerek **GET** metoduyla istek attığınızda seferleri bütün detaylarıyla getirir.
**Örnek:** `/seferler/detay/125`
125 numaralı seferin bütün detayları getirecektir. Sefer bulunamazsa hata mesajı döner.

##### /seferler/:seferNo/biletal #####

Bilet almak için hangi seferden koltuk alacaksanız sefer numarası ve sorgu parametrelerini **PATCH** metoduyla göndererek işlemi gerçekleştirebiliriz.
sorgu parametreleri `koltukno` ve `cinsiyetler` olup endpoint'in sonuna **soru işareti** koyarak eklenirler, ve her bir parametre aralarında **&(ampersand)** olacak şekilde yanyana yazılır.

**Örneğin**; **125** numaralı seferdeki **15** ve **21** numaralı koltukları almak için `koltukno=15,21` sorgusu, bu koltukların sırasıyla Erkek ve Kadın cinsiyetlerinde alınmak istediğini belirtmek için ise `cinsiyetler=Erkek,Kadın` sorgusu yazılarak istek atılır.

O halde; her iki sorgu parametresini birleştirerek aralarına **&** sembolü koyarsak ve sefer numarasını endpoint'teki **:seferNo** ile belirtilen alana yazarsak isteğimizin son hali aşağıdaki gibi olur:

`/seferler/125/biletal?koltukno=15,21&cinsiyetler=Erkek,Kadın`

Bu istekte şartlar sağlandığı takdirde 125 numaralı seferden ==15 numaralı yolcumuz için Erkek, 21 numaralı yolcumuz için Kadın== cinsiyetlerinde bilet almak istediğimizi belirtiyoruz.
###### Not: Parametre sıralamalarının önemli olduğu unutulmamalıdır ! ######



##### /biletlerim #####

Bu endpoint'e istek atarken herhangi bir parametre girmeniz gerek yok, kullanıcı bilgileri middleware ile decode edilerek alınıyor. **GET** metoduyla istek atılır.
 Sadece hangi seferden hangi koltukları başarıyla aldıysanız o numaralar ve ilgili sefer numaraları response olarak döner.
 
 
 ##### /biletlerim/detaylar #####
 Aynı şekilde; bu endpoint'e istek atarken herhangi bir parametre girmeniz gerek yok, kullanıcı bilgileri middleware ile decode edilerek alınıyor.**GET** metoduyla istek atılır.
 Response olarak sefer ve biletlerle ilgili bütün detaylar ayrıntılarıyla döner. (Kalkış ve varış şehri, bilet fiyatı, kalkış saati, alınan koltuklar, sefer numarası vb.)
 
 
 
 









