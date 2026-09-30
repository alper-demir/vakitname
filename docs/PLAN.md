# Devam noktası — 30 Eylül 2026

Kullanıcı geliştirmeyi onayladı. Repository kökünde ilk çalışan dikey dilim var. **Sonraki adım Home incelemesi ve gerçek cihaz doğrulaması.** Diğer tam ekranları topluca geliştirme.

## Tamamlandı

- 37 Stitch ekranı analiz edildi; 19 Home varyasyonu tek Home/tema sisteminde toplandı. İki tasarım klasörü korunuyor.
- Expo 57.0.26, RN 0.86.3, React 19.2.3, Router, strict TS, Node 24 LTS ve lockfile.
- 81 il + 974 GeoNames ilçe kaydıyla offline arama/onay; foreground GPS, ret/timeout ve manuel fallback.
- Adhan provider, UTC olaylar, seçili Türkiye saat dilimi, vakit düzeltme altyapısı, dün/bugün/yarın ve Yatsı sonrası İmsak.
- Foreground sayaç, GPS konumu için arka plandan dönüşte izin istemeden yenileme, tek Home, altı gerçek vakit, kaynak modalı, dört mevsim/dört faz/Ramazan tema resolver'ı ve temel görünüm seçimi.
- SQLite KV kalıcılık, bozuk kayıt kurtarma, async GPS yarış koruması; web incelemede localStorage.
- 2026–2027 Hicri ay başlangıçları, kapsam dışı açık kaynaklı hesaplanan fallback, Ramazan sınırları.
- 35 test, üç host saat diliminde 22 ek test, lint/typecheck, Expo Doctor 21/21, Android/iOS/web bundle export. Ayrıntılar VALIDATION.md.

## İlk dilimde açık kalan doğrulamalar

- Gerçek iOS/Android development build: GPS/izinler, background→foreground, büyük metin/screen reader ve Hermes takvim desteği. Expo Go ile Android emülatörde manuel Ankara → Çankaya seçimi, hesaplanan Home ve Expo Go zorla kapatılıp açıldıktan sonra SQLite kalıcılığı doğrulandı. İstenmeden başlatılan native build tamamlanmadan durduruldu; `android/`, `dist/` ve eklenen paket/config değişiklikleri temizlendi. Kullanıcı açıkça istemeden APK/prebuild yapma.
- Diyanet yalnız İstanbul tek gün karşılaştırıldı (0–2 dk fark); yedi şehir/mevsimler/Ramazan matrisi tamamlanmadan üretim uyumu iddia edilmez.
- GeoNames resmî ilçe kapsamı, 29 yaklaşık temsil koordinatı. 974 kayıt sayısı resmî güncel ilçe sayısı iddiası değildir.
- npm audit iki transitif advisory nedeniyle 14 moderate: uyumlu çözüm release öncesi; uyumsuz downgrade/force uygulanmadı.
- Tema renkleri merkezidir; halka/ilk görünüm animasyonu var. Tüm paletler arasında renk interpolasyonu henüz yok. Türkçe çekirdek sözlük var; bazı ekran metinlerinin tam i18n ayrımı İngilizce aşamasında.

## Home sonrasında

1. Home geri bildirimi, gerçek cihaz testi ve veri doğrulamalarını kapat.
2. Onboarding + genel/hesaplama/Hicri ayarları. Dakika/Hicri düzeltmeleri domain'de var, kullanıcı ayar ekranı henüz yok.
3. Yerel bildirim planlayıcı, izinler, kısa lisanslı ses, yardım; gerçek iki platform testi. ARCHITECTURE.md'deki kuyruk/OS sınırlarına uy.
4. Aylık takvim ve Ramazan imsakiyesi.
5. Kıble ve sensörsüz/kalibrasyon durumları.
6. Gizlilik/lisans ekranı, ikon/splash, mağaza kimlikleri, erişilebilirlik ve release build.

Hesap, reklam, backend, widget, tam ezan, PDF, mukabele ve zikirmatik kapsam dışı. Remote/push/yayınlama yapılmadı.

## Devam komutları

Node 24 ile `npm run check`, `npm run test:timezones`, `npx expo-doctor`. Çalıştırma README'de. Android emülatör incelemesi için Metro'yu `npm start -- --lan` ile açıp Expo Go kullan. `npm run android`, prebuild ve APK/AAB ancak kullanıcı açıkça isterse.

## Oturum devri

- Git düzeni `docs/VERSIONING.md` içindedir: `main` doğrulanmış/tag'li kilometre taşları, `develop` aktif entegrasyon, gerektiğinde `feature/*` ve `fix/*`. İlk geri dönüş noktası `v0.1.0`; sonraki çalışma `develop` üzerinde sürer. Remote henüz yapılandırılmadı.
- İlk okunacak dosyalar: `AGENTS.md`, ardından bu dosya. Tasarım ayrıntısı gerekirse `docs/DESIGN.md`; teknik karar gerekirse `docs/ARCHITECTURE.md`; kanıt ve açık kontroller için `docs/VALIDATION.md`.
- Son doğrulanan çalışma biçimi: Android 16 Pixel 7 emülatörü, Expo Go 57.0.9, LAN Metro `8081`; Home ve offline konum listesi açıldı. Metro süreçleri oturumlar arasında kalıcı kabul edilmez.
- Şu an yapılacak iş: Expo Go'da GPS izin ret/başarı durumları; ardından küçük ekran, büyük yazı ve TalkBack kontrolü. GPS kaynaklı arka plan dönüşü yenilemesi test edildi. Manuel Ankara → Çankaya seçimi, gerçek Home ve yeniden açılışta SQLite kalıcılığı 30 Eylül 2026'da doğrulandı.
- `android/` ve `dist/` mevcut değil; APK/AAB yok. `expo-system-ui` kaldırıldı ve `app.json` prebuild öncesi durumuna döndü.

Yeni oturumda AGENTS.md ve bu dosyayı oku; tüm tasarımları tekrar tarama. Mimari/kaynak/validasyon belgelerinin yalnız gerekli bölümünü aç.
