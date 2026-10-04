# Google Play yayın ve gizlilik kontrolü

İnceleme tarihi: 2 Ekim 2026  
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

Bu repository'deki `privacy-site/index.html` bu amaçla hazırlanmıştır. PDF yalnız arşiv/inceleme kopyasıdır ve Play Console gizlilik URL'si olarak kullanılmamalıdır. Kaynaklar: [Google Play kullanıcı verileri politikası](https://support.google.com/googleplay/android-developer/answer/10144311), [uygulamayı incelemeye hazırlama](https://support.google.com/googleplay/android-developer/answer/9859455).

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

1. `android.package` benzersiz uygulama kimliği henüz `app.json` içinde tanımlı değil.
2. Herkese açık destek adresi kullanıcı tarafından `support.alemdem@gmail.com` olarak doğrulandı. Geliştirici adı Play geliştirici profiliyle birebir doğrulanmalı.
3. `privacy-site/` Netlify gibi herkese açık bir HTTPS adrese yüklenmeli; oluşan URL uygulamadaki Hakkında ekranına ve Play Console'a eklenmeli.
4. Production AAB manifesti ve Play Console App Bundle Explorer'daki izinler denetlenmeli. Expo Go manifesti release kanıtı değildir.
5. Production build'de bildirim izni, özel ses, sessiz kanal, force-stop/reboot/Doze davranışı doğrulanmalı.
6. Hedef kitle, içerik derecelendirmesi ve Families seçimi ürün sahibince tamamlanmalı. Uygulama çocuklara özel hedeflenmiyorsa bu seçim mağaza metni ve görsellerle tutarlı olmalı.
7. Mağaza ikonları, telefon/tablet ekran görüntüleri, feature graphic ve destek e-postası hazırlanmalı.
8. Resmî Diyanet uyumu iddia edilmemeli; mağaza metnindeki kaynak ve bağımsızlık açıklaması korunmalı.
9. Release öncesi bağımlılık/SDK veri davranışı ve mevcut `npm audit` bulguları yeniden incelenmeli.

## KVKK notu

KVKK'nın aydınlatma çerçevesi; veri sorumlusunun kimliği, işleme amacı, aktarım tarafları ve amacı, toplama yöntemi/hukuki sebep ile ilgili kişi haklarının açıklanmasını ister. Hazırlanan politika bu başlıkları teknik gerçekle uyumlu biçimde kapsar; geliştirici kimliği ve hukuki sebep yayımdan önce hukuk danışmanıyla doğrulanmalıdır. Kaynak: [KVKK Aydınlatma Yükümlülüğü](https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-).
