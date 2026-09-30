# İlk dilim doğrulaması — 30 Eylül 2026

## Geçen kontroller

- TypeScript strict, ESLint, 35 Jest testi. Gerçek Home/konum componentleriyle GPS reddi → manuel seçim → Home → kayıtlı yeniden açılış; GPS konumunda arka plandan dönüşte izin istemeden yenileme.
- Geç GPS sonucunun yeni manuel seçimi ezmemesi; yenileme hatasında son konumun korunması; storage okuma hatasında okunamamış verinin varsayılanlarla ezilmemesi.
- 22 tarih/hesaplama/tema testi ayrı süreçlerde Europe/Istanbul, UTC, America/New_York altında aynı sonucu verdi.
- Expo Doctor 21/21. Android/iOS Hermes ve web bundle export başarılı. Expo Go 57.0.9 ile Android 16 Pixel 7 emülatörde LAN Metro üzerinden Ankara → Çankaya manuel seçimi, gerçek hesaplanan Home, Yatsı sonrası ertesi gün İmsak hedefi ve Expo Go zorla kapatılıp açıldıktan sonra SQLite kalıcılığı doğrulandı. **Export native build değildir; native build tamamlanmadan durdurulup tüm proje çıktıları temizlendi.**
- Web önizlemede manuel seçim ve Yatsı sonrası yarının İmsak hedefi görüldü. Native GPS/izin ve erişilebilirlik doğrulaması açık.

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

- Android/iOS development build; GPS ret/kalıcı ret/kapalı servis/timeout. Android Expo Go yeniden açılışında SQLite verisi doğrulandı; iOS ve development build hâlâ açık.
- Foreground saat sıçraması/gece yarısı; Hermes Intl takvim fallback'i.
- VoiceOver/TalkBack, büyük metin, azaltılmış hareket ve kontrast.
- GeoNames resmî ilçe listesi kapsamı ve 29 yaklaşık koordinatın iyileştirilmesi; sınır noktaları.
- Bildirimler bu dilimde yok. Kuyruk/izin/ses/reboot/force-stop sonraki aşama.
- Uygulama kimliği, ikon/splash, mağaza metinleri, imzalama ve release build henüz yok.

Tasarım koruması: 76 referans dosyasının sıralı yol+SHA256 birleşik hash'i başlangıçla aynı: 72526F33396A5AD829A975E55BE0573E60892FF7B38657842F83D9BA970ECB79. Kaynak/konfigürasyon dosyalarında anahtar kalıbı taraması temiz. 390×844 web görünümünde sayaç/konum/ertesi gün kartı ve kaydırılabilir vakitler kontrol edildi; screenshot artifacts/home-mobile.png (Git dışında).
