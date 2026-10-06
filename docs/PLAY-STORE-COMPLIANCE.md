# Google Play yayın ve gizlilik kontrolü

İnceleme tarihi: 4 Ekim 2026
Kapsam: Vakit 0.3.0-rc.1 kaynak kodu ve Expo yapılandırması. Bu belge hukuki danışmanlık değildir; Play Console yanıtları yayımlanan AAB ve kullanılan geliştirici hesabıyla son kez doğrulanmalıdır.

## Mevcut veri akışı

- Hesap, reklam, analiz, uzaktan hata izleme, backend ve push tokenı yok.
- GPS koordinatı, yer etiketi, doğruluk ve ölçüm zamanı cihazdaki SQLite KV alanında saklanıyor.
- Pusula başlığı yalnız Kıble ekranı açıkken anlık okunuyor ve saklanmıyor.
- Tema, takvim/vakit düzeltmeleri ve bildirim tercihleri cihazda saklanıyor.
- Kodda kullanıcı verisini cihaz dışına gönderen `fetch`, Axios, WebSocket veya benzeri uygulama ağı bulunmuyor.
- Kaynak bağlantıları ancak kullanıcı dokununca sistem tarayıcısında açılıyor.

Google Play, “toplama”yı verinin cihaz dışına iletilmesi olarak tanımlar; yalnız cihazda erişilen ve işlenen veriler Veri Güvenliği formunda “toplanan veri” sayılmaz. Bu nedenle mevcut üretim kodu ve üçüncü taraf SDK davranışı değişmezse önerilen beyan:

| Play Console sorusu | Önerilen yanıt | Dayanak |
|---|---|---|
| Uygulama gerekli kullanıcı verisi türlerinden herhangi birini topluyor veya paylaşıyor mu? | Hayır | Veriler yalnız cihazda işleniyor; uygulama ağı/backend/analiz yok. |
| Veriler üçüncü taraflarla paylaşılıyor mu? | Hayır | Uygulama kullanıcı verisini cihaz dışına iletmiyor. |
| Uygulama hesap oluşturmayı destekliyor mu? | Hayır | Hesap sistemi yok. |
| Hesap silme URL'si veya hesap silme akışı gerekiyor mu? | Hayır | Uygulama hesap oluşturmaz; sunucuda kullanıcı hesabı veya hesaba bağlı veri yoktur. Yerel veri Android'den “veriyi temizle” veya kaldırma ile silinir. |
| Veriler aktarım sırasında şifreleniyor mu? | Uygulanamaz | Kullanıcı verisi aktarılmıyor. Play Console arayüzünün gösterdiği seçeneğe göre yanıtlanmalı. |

Resmî kaynak: [Google Play Veri Güvenliği formu](https://support.google.com/googleplay/android-developer/answer/10787469). Form, Expo/React Native sürümü veya eklenen herhangi bir SDK değiştiğinde yeniden denetlenmelidir.

## İzin envanteri ve kullanıcıya açıklama

| İzin / erişim | Kullanım | Zorunluluk ve geri dönüş |
|---|---|---|
| `ACCESS_COARSE_LOCATION` | Yaklaşık konumla vakit ve kıble hesabı | İsteğe bağlı; manuel şehir seçimi var. |
| `ACCESS_FINE_LOCATION` | Daha hassas vakit/kıble hesabı ve gerçek kuzey desteği | İsteğe bağlı; yalnız ön planda istenir. |
| Arka plan konumu | Kullanılmıyor ve `blockedPermissions` ile engelleniyor | İstenmemeli. |
| Android 13+ bildirim izni | Kullanıcının seçtiği vakit hatırlatmaları | İsteğe bağlı; reddedilince uygulamanın diğer işlevleri çalışır. |
| `SCHEDULE_EXACT_ALARM` özel erişimi | Vakit ve “15/30/45 dakika önce” kayıtlarının Android tarafından geniş bir teslim penceresine bırakılmaması | İsteğe bağlı; kullanıcı uygulama içindeki açıklamadan Android'in **Alarmlar ve hatırlatıcılar** ekranına gider. Reddedilirse yaklaşık yerel zamanlama devam eder. |
| Pusula/yön sensörü | Kıble ekranında canlı hizalama | Yalnız ekran açıkken; başlık saklanmaz. |

`USE_EXACT_ALARM` kullanılmaz. Bu izin Google Play'de yalnız temel işlevi alarm/zamanlayıcı/takvim olan dar kullanım alanlarına otomatik verilebildiğinden, Vakit kullanıcı tarafından yönetilen `SCHEDULE_EXACT_ALARM` yolunu kullanır. Özel erişim kapalıyken bildirimler iptal edilmez; Android'in yaklaşık zamanlamasına düşer. Pil, üretici, sessiz mod ve bildirim kanalı ayarları yine teslimi etkileyebilir. Play Console'da AAB manifesti ve exact-alarm beyan ekranı son kez doğrulanmalıdır. [Google Play exact alarm politikası](https://support.google.com/googleplay/android-developer/answer/16558241), [Android 14 davranışı](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms).

## Gizlilik politikası teslimi

Google Play için kullanılacak ana bağlantı PDF olamaz. Politika:

- aktif, herkese açık, coğrafi kısıtsız ve düzenlenemeyen bir HTML URL'sinde olmalı;
- standart tarayıcıda giriş, eklenti veya JavaScript gerektirmeden okunmalı;
- Play Console mağaza kaydında ve uygulama içinde erişilebilir olmalı;
- uygulama ve geliştirici adını, gizlilik iletişimini, erişilen veri türlerini, kullanım/paylaşım amaçlarını, güvenliği, saklama ve silme yaklaşımını açıklamalı;
- Veri Güvenliği formuyla tutarlı olmalı.

Bu repository'deki `privacy-site/index.html` bu amaçla hazırlanmış ve [https://vakit-privacy.netlify.app/](https://vakit-privacy.netlify.app/) adresinde yayımlanmıştır. PDF yalnız arşiv/inceleme kopyasıdır ve Play Console gizlilik URL'si olarak kullanılmamalıdır. Kaynaklar: [Google Play kullanıcı verileri politikası](https://support.google.com/googleplay/android-developer/answer/10144311), [uygulamayı incelemeye hazırlama](https://support.google.com/googleplay/android-developer/answer/9859455).

## Mağaza açıklaması taslağı

Kısa açıklama (80 karakter sınırı için son Console sayımı yapılmalı):

> Namaz vakitleri, kıble ve Ramazan takvimi; reklamsız ve cihazında.

Tam açıklama taslağı:

> Vakit, Türkiye'deki seçili konumuna göre namaz vakitlerini cihazında hesaplayan sade bir Android uygulamasıdır. Sıradaki vakti ve kalan süreyi görür, aylık takvim ile Ramazan imsakiyesini inceleyebilir, kıble yönünü hesaplayabilir ve istersen yerel bildirimler planlayabilirsin.
>
> - Hesapsız ve reklamsız kullanım
> - GPS veya manuel şehir/ilçe seçimi
> - Cihazda namaz vakti ve kıble hesabı
> - Aylık vakit takvimi ve Ramazan imsakiyesi
> - Mevsim, gün fazı ve Ramazan temaları
> - İsteğe bağlı yerel vakit bildirimleri
> - Kullanıcıya açık vakit ve Hicri tarih düzeltmeleri
>
> Vakit resmî bir Diyanet uygulaması değildir. Saatler Adhan JS Türkiye hesaplama yöntemiyle cihazda üretilir ve resmî tablolarla küçük farklılıklar gösterebilir. Konum ve tercihler cihazında tutulur; uygulama hesap, reklam, analiz veya geliştirici sunucusu kullanmaz.

## Yayın öncesi açık kapılar

1. Uygulamanın mağaza adı kesinleştirilmeli. Kaynakta hâlâ **Vakit** yazıyor; konuşulan **Vakitname: Namaz & Kıble** adı henüz uygulamaya, gizlilik metnine veya mağaza materyallerine uygulanmadı.
2. `android.package` benzersiz uygulama kimliği ve Android `versionCode` henüz `app.json` içinde tanımlı değil. İmzalama/build yöntemi ile `eas.json` da oluşturulmadı.
3. Herkese açık destek adresi kullanıcı tarafından `support.alemdem@gmail.com` olarak doğrulandı. Geliştirici adı Play geliştirici profiliyle birebir doğrulanmalı.
4. `privacy-site/` içeriği `https://vakit-privacy.netlify.app/` adresinde yayımlandı ve Hakkında ekranına eklendi; aynı URL Play Console gizlilik politikası alanına girilmeli.
5. Production AAB manifesti ve Play Console App Bundle Explorer'daki izinler denetlenmeli. Expo Go manifesti release kanıtı değildir.
6. Production build'de bildirim izni, kesin zamanlama, günlük arka plan kuyruk yenilemesi, özel ses, sessiz kanal, ekran kilidi, force-stop/reboot/Doze ve pil davranışı doğrulanmalı.
7. Hedef kitle, içerik derecelendirmesi, reklam/Veri Güvenliği ve Families seçimleri ürün sahibince tamamlanmalı. Uygulama çocuklara özel hedeflenmiyorsa bu seçim mağaza metni ve görsellerle tutarlı olmalı.
8. 512×512 mağaza ikonu, feature graphic ve en az iki telefon ekran görüntüsü hazırlanmalı; kısa/tam açıklama son isim ve gerçek release davranışıyla son kez düzenlenmeli. Tablet desteği sunulacaksa tablet görselleri ayrıca hazırlanmalı.
9. Resmî Diyanet uyumu iddia edilmemeli; mağaza metnindeki kaynak ve bağımsızlık açıklaması korunmalı.
10. Release öncesi bağımlılık/SDK veri davranışı ve mevcut `npm audit` bulguları yeniden incelenmeli. 6 Ekim kaydı tüm ağaçta 50 high/16 moderate, `--omit=dev` görünümünde 46 high/16 moderate bulgudur; çoğu Expo/Metro/Jest araç zincirinden gelir ancak Android bundle etkisi ayrıştırılmadan yayın hazır kabul edilmemeli.
11. Expo SDK 57 Android API 36 hedefler ve 31 Ağustos 2026'dan itibaren yeni mobil uygulamalar için gereken API 36 seviyesini karşılar; oluşturulan AAB manifestinde bu değer doğrulanmalı. Kaynaklar: [Expo SDK sürüm tablosu](https://docs.expo.dev/versions/latest/), [Google Play hedef API şartı](https://support.google.com/googleplay/android-developer/answer/11926878).
12. Play geliştirici hesabı 13 Kasım 2023'ten sonra açılmış kişisel hesapsa production erişiminden önce en az 12 test kullanıcısının 14 gün kesintisiz katıldığı kapalı test gerekir. Hesap türü ve açılış tarihi Play Console'dan kontrol edilmeli. Kaynak: [Google Play yeni kişisel hesap test şartı](https://support.google.com/googleplay/android-developer/answer/14151465).

## KVKK notu

KVKK'nın aydınlatma çerçevesi; veri sorumlusunun kimliği, işleme amacı, aktarım tarafları ve amacı, toplama yöntemi/hukuki sebep ile ilgili kişi haklarının açıklanmasını ister. Hazırlanan politika bu başlıkları teknik gerçekle uyumlu biçimde kapsar; geliştirici kimliği ve hukuki sebep yayımdan önce hukuk danışmanıyla doğrulanmalıdır. Kaynak: [KVKK Aydınlatma Yükümlülüğü](https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-).
