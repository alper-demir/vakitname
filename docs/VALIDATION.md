# Faz 1–6 doğrulaması — 1 Ekim 2026

## Geçen kontroller

- TypeScript strict, ESLint, 58 Jest testi. Gerçek Home/konum componentleriyle GPS reddi → manuel seçim → Home → kayıtlı yeniden açılış; GPS konumunda arka plandan dönüşte izin istemeden yenileme.
- Onboarding'in konumsuz tamamlanması ve kalıcılığı, v1→v2 state göçü, vakit/Hicri düzeltmelerinin sınırlandırılmış state üzerinden kaydı test edildi.
- Expo Go 57.0.9 / Android 16 Pixel 7 üzerinde sistem izin diyaloğu, ret sonrası Türkçe fallback ve izin sonrası konum isteği denendi. 720×1280 küçük ekran ve 1.3 font ölçeğinde Home kaydırma/alt dock kontrol edildi; erişilebilirlik ağacı için TalkBack servisi emülatörde mevcut değildi, Jest ve native accessibility etiketleri doğrulandı.
- Geç GPS sonucunun yeni manuel seçimi ezmemesi; yenileme hatasında son konumun korunması; storage okuma hatasında okunamamış verinin varsayılanlarla ezilmemesi.
- 27 tarih/hesaplama/tema testi ayrı süreçlerde Europe/Istanbul, UTC, America/New_York altında aynı sonucu verdi.
- Expo Doctor 21/21. Android/iOS Hermes ve web bundle export başarılı. Expo Go 57.0.9 ile Android 16 Pixel 7 emülatörde LAN Metro üzerinden Ankara → Çankaya manuel seçimi, gerçek hesaplanan Home, Yatsı sonrası ertesi gün İmsak hedefi ve Expo Go zorla kapatılıp açıldıktan sonra SQLite kalıcılığı doğrulandı. **Export native build değildir; native build tamamlanmadan durdurulup tüm proje çıktıları temizlendi.**
- Web önizlemede manuel seçim ve Yatsı sonrası yarının İmsak hedefi görüldü. Native GPS/izin ve erişilebilirlik doğrulaması açık.
- Android Expo Go'da genel ayarlar, hesaplama ve Hicri ekranları görsel olarak kontrol edildi. İmsak +1 düzeltmesi Home hesabına anında yansıdı ve genel ayarlarda “1 düzeltme” özeti görüldü. Hicri +1 canlı önizlemeyi 19'dan 20 Rebiülahir'e taşıdı. Deneme değerleri doğrulama sonunda tekrar 0'a getirildi.
- Faz 3 saf planlayıcı için gelecek olay, kronolojik sıra, 60 bildirim sınırı, varsayılan kapalı Güneş ve benzersiz kimlikler; scheduler farkı için eşleşeni koruma/eskiyi çıkarma; v2→v3 güvenli migration test edildi.
- Faz 4 takvim domain testleri: aylık gün satırları ve gerçek provider vakitleri, 2026 Ramazan 29 gün sınırı, 2030 Umm al-Qura fallback aralığı ve Hicri gösterim offset'inin namaz saatlerinden bağımsız kalması doğrulandı.
- Faz 5 Kıble domain testleri: İstanbul için büyük çember ilk doğrultusu 151,6° ve yaklaşık 2.405 km, yön normalizasyonu ve en kısa imzalı dönüş doğrulandı. Toplam 58 Jest testi, strict typecheck ve ESLint geçti; zaman dilimi regresyonu Europe/Istanbul, UTC ve America/New_York altında 27 test ile geçti. Expo Doctor 21/21 geçti.
- Görünüm tercihine manuel Şafak, Gündüz, Gün batımı ve Gece fazları eklendi. Dört fazın hesaplanan saat fazını geçersiz kılması, karanlık/aydınlık durumu, v3 state içinde kalıcılığı ve gün ortasında seçilen Gün batımı temasının Home'da “Sonbahar · Gün batımı” olarak görünmesi test edildi.
- Işık seçimleri sadeleştirildi; Cihaz teması, Her zaman aydınlık ve Her zaman karanlık seçeneklerinin UI'dan kaldırılması, eski v3 değerlerinin solar/day/night olarak güvenli eşlenmesi ve yalnız otomatik + dört manuel fazın görünmesi test edildi.
- Android 16 Pixel 7 / Expo Go 57.0.9'da Metro 8081 yeniden başlatılıp güncel bundle açıldı; Ayarlar → Görünüm → Işık ekranında Şafak, Gündüz, Gün batımı ve Gece seçenekleri cihaz ekranında görünür ve radyo seçimi işaretli olarak doğrulandı. Önceki görünmeme durumu eski/cache bundle nedeniyleydi.
- Global tema geçişi iki gradienti karıştırmak yerine yeni paleti 520 ms boyunca %16 opaklıklı koyu perdeyle yumuşatan tek Backdrop animasyonu olarak düzenlendi; böylece açık/koyu geçişte beyaz-gri ara flaş engellendi. Hareketi azalt açıksa süre sıfırlanır. Android 16 Pixel 7 / Expo Go'da manuel Gün batımı → Gündüz ve diğer faz seçimleri ara karelerle tekrarlandı; beyaz flaş görülmedi. Fiziksel cihazda kare akıcılığı ayrıca release öncesi gözlenecek.
- Konum ekranının kök Türkiye listesi “81 kayıt” yerine “81 il” gösteriyor; il içi liste “ilçe”, arama listesi “sonuç” birimini kullanıyor. Component akış testi kök etiketi doğruluyor.
- Android 16 Pixel 7 / Expo Go 57.0.9'da Takvim ekranı açıldı. Ekim 2026 aylık görünümünde Mesudiye konumuna ait gerçek hesaplanan vakitler ve yatay tablo başlıkları görüldü; Ramazan görünümünde 1448 Hicri, 29 gün ve 8 Şubat–8 Mart 2027 aralığı ile İmsak/Akşam/Yatsı satırları görüldü. PDF/paylaşım veya Diyanet tam uyumu iddiası eklenmedi.
- Android 16 Pixel 7 / Expo Go 57.0.9'da Ramazan atmosferi “Her zaman açık” ile Ramazan dışındaki 1 Ekim tarihinde önizlendi. Gündüz fildişi–yeşil ve gece zümrüt–lacivert paletleri, altın vurgu, hilal/yıldız dekoru ve ilgili tema geçişleri ekranda görüldü; tarih ile takvim değişmedi. Kontrol sonunda tercih varsayılan `Ramazan’da otomatik` ve `Gün ışığına göre` durumuna döndürüldü.
- Android 16 Pixel 7 / Expo Go güncel bundle'ında Home alt barındaki Ayarlar ikonu görsel olarak kontrol edildi; güneş benzeri ışınlı çizim yerine merkez delikli dişli SVG görünüyor.
- Home component testi 2026 Ramazan arifesi gecesinde ana halkada “İmsaka kalan süre”, ilk oruç günü öğleninde “İftara kalan süre” metnini doğruladı. Her iki durumda Sahur/İmsak ve İftar/Akşam kartları render edildi; Ramazan dışı zorunlu tema önizlemesinin sahte oruç hedefi üretmemesi mevcut domain sınırıyla korundu.
- 1 Ekim 2026 Faz 4 devam kontrolünde Android 16 Pixel 7 / Expo Go 57.0.9'da Kâğıthane için Ekim 2026'dan Kasım 2026'ya geçiş, 1448 Hicri 29 günlük Ramazan görünümü (8 Şubat–8 Mart 2027), Hicri düzeltmenin 20 Rebiülahir'den +1 ile 21'e çıkıp tekrar 20'ye dönmesi doğrulandı. Emülatör 720×1280'e geçici alınarak aylık kartın okunabilirliği ve yatay tabloda Güneş/Öğle sütunlarına kaydırma gözlendi; çözünürlük sonrasında 1080×2400'e geri alındı. 2030 fallback'i UI'da yıl seçicisi olmadığı için domain testiyle doğrulandı, cihaz ekranında açılmadı.
- Android 16 Pixel 7 / Expo Go 57.0.9'da Home alt menüsünden Kıble ekranı açıldı. Mesudiye için hesaplanan 174° Güney ve yaklaşık 2.125 km, gerçek-kuzey açıklaması ve sensörsüz “Cihaz pusulası kullanılamıyor” durumu görünür. Emülatörde fiziksel yön sensörü olmadığı için gerçek-kuzey/manyetik başlık, izin sonrası canlı hizalama ve kalibrasyon davranışı kanıtlanmadı.
- Android 16 Pixel 7 / Expo Go 57.0.9'da Bildirimler ve Bildirim durumu ekranları açıldı. İlk public `expo-notifications` importu kaldırılan push modülü nedeniyle, kanal oluşturma da Expo Go'daki eksik native provider nedeniyle hata verdi. Expo Go'ya özel yerel alt modül + varsayılan kanal adaptörüyle temiz izin durumunda Android izin diyaloğu açıldı ve izin verildikten sonra ana anahtar etkinleşti.
- Aynı emülatörde 60 gelecek Vakit olayı gerçek pending/alarm kuyruğunda görüldü; yardım ekranı 60 olay ve son plan tarihini gösterdi. Üç saniyelik test uygulama arka plandayken “Vakit bildirimi hazır” başlığı ve beklenen gövdeyle sistem bildirimine teslim edildi. Expo Go alarmları kesin alarm yetkisi olmadan geniş teslim pencereleriyle kaydetti; bu sonuç tam dakika garantisi değildir. Özgün `vakit-tone.wav`, sessiz kanal ve versioned production kanalları Expo Go'da doğrulanmadı.

## İlk Diyanet karşılaştırması

[İstanbul günlük tablo](https://namazvakitleri.diyanet.gov.tr/tr-TR/9541/istanbul-icin-namaz-vakti), 30 Eylül 2026; aynı gün alındı. Adhan koordinatı 41.01384, 28.94966, Europe/Istanbul, Turkey preset, kullanıcı düzeltmeleri sıfır.

| Vakit | Resmî tablo | Adhan 4.4.6 | Fark (dk) |
|---|---|---|---|
| İmsak | 05:28 | 05:28 | 0 |
| Güneş | 06:52 | 06:53 | +1 |
| Öğle | 12:59 | 12:59 | 0 |
| İkindi | 16:18 | 16:16 | −2 |
| Akşam | 18:56 | 18:55 | −1 |
| Yatsı | 20:15 | 20:14 | −1 |

Ortalama mutlak fark 0,83 dk, en büyük 2 dk. Tek gün/şehir doğruluk sertifikası değildir. Farklar kullanıcı düzeltmesine gizlice eklenmedi. Yedi şehir × mevsimler/Ramazan karşılaştırması release öncesi açık.

## Paket güvenliği

npm audit: 0 critical/high, 14 moderate rapor; çoğu aynı iki advisory'nin üst paketlere yayılımı. [decode-uri-component](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr) Router → query-string üzerinden runtime URI ayrıştırmayı etkiler. [uuid](https://github.com/advisories/GHSA-w5hq-g745-h8pq) Expo xcode build araç zincirindedir. Otomatik öneri Expo 46/Router 5'e uyumsuz düşürme; uygulanmadı. decode-uri-component 0.5 API/modül uyumu doğrulanmadan override yapılmadı. **Release öncesi upstream uyumlu düzeltme veya doğrulanmış adaptör gerekir.**

## Açık cihaz/release kontrolleri

- iOS development build ve gerçek iOS izin/TalkBack testi release kapısıdır. Android Expo Go yeniden açılışında SQLite verisi doğrulandı; emülatör GPS sağlayıcısı sabit fix vermediği için Android başarı yolu gerçek koordinat yerine timeout ile sınırlı kaldı.
- Foreground saat sıçraması/gece yarısı; Hermes Intl takvim fallback'i.
- VoiceOver/TalkBack gerçek cihaz testi; azaltılmış hareket ve kontrast.
- GeoNames resmî ilçe listesi kapsamı ve 29 yaklaşık koordinatın iyileştirilmesi; sınır noktaları.
- Android Expo Go izin, pending kuyruk ve varsayılan kanalda arka plan teslimi geçti. Android/iOS development build üzerinde özgün ses, sessiz kanal, ekran kilidi, reboot, force-stop, pil tasarrufu ve kesin alarm davranışı; ayrıca gerçek cihaz/iOS izinleri açık release kapısıdır.
- Faz 4 için gerçek cihaz erişilebilirlik, aylar arası performans ve küçük ekran yatay tablo kontrolü henüz release kanıtı değildir; emülatör gözlemi yalnız Android Expo Go ile sınırlıdır.
- Faz 5 için gerçek Android/iOS cihazda konum izni ret/verme, trueHeading yokken manyetik veri, yüksek/düşük hassasiyet, hareket/kalibrasyon ve ekran kapanınca başlık aboneliğinin durması doğrulanmalıdır. Emülatördeki sensörsüz durum bu kontrollerin yerine geçmez.
- Faz 6 için native release build, launcher maskesi, Play Console önizlemesi ve bildirim/ikon kaynaklarının gerçek Android cihazda doğrulanması gerekir. Hakkında/Gizlilik/Kaynak/Lisans ekranı, splash config çıktısı, erişilebilir başlık/etiketler ve Android ikon asset entegrasyonu Expo config ile doğrulandı; kullanıcı ikonu `assets/icon/` altında işlendi. Expo Go, native launcher ikonunu güncellemez.
- Android 16 Pixel 7 / Expo Go 57.0.9'da güncel Metro bundle yeniden açıldı; Settings akışı ve yeni raster asset importu hata vermeden çalıştı. Bu, adaptive launcher maskesinin veya native splash görselinin kanıtı değildir.
- Android 16 Pixel 7 / Expo Go 57.0.9'da Ayarlar → Hakkında ve gizlilik ekranı açıldı; marka başlığı, veri saklama özeti, kaynak kartı ve lisans içeriği küçük ekran kaydırma düzeninde okunabilir göründü. Native OS splash görüntüsü Expo Go'da ayrı doğrulanmadı; Expo config yalnız arka plan renkleriyle doğrulandı.
- Uygulama kimliği, mağaza metinleri, imzalama ve Android native release build henüz yok. Android ikon ve splash config'i repository'de mevcut; native launcher/Play Store önizlemesi ayrıca doğrulanacak.

Tasarım koruması: 76 referans dosyasının sıralı yol+SHA256 birleşik hash'i başlangıçla aynı: 72526F33396A5AD829A975E55BE0573E60892FF7B38657842F83D9BA970ECB79. Kaynak/konfigürasyon dosyalarında anahtar kalıbı taraması temiz. 390×844 web görünümünde sayaç/konum/ertesi gün kartı ve kaydırılabilir vakitler kontrol edildi; screenshot artifacts/home-mobile.png (Git dışında).
