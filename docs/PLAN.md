# Devam noktası — 1 Ekim 2026

Kullanıcı geliştirmeyi onayladı. Repository kökünde Faz 1 ve Faz 2 çalışan durumda. **Faz 3 yerel bildirimlerin kodu ile Android Expo Go doğrulama dilimi tamamlandı; production native doğrulama kapısı açık.** Development build/APK üretme; kullanıcı daha önce yalnız Expo Go istemişti.

## Faz 1–2 durumu

İlk dikey dilim ile Faz 2 onboarding/ayarlar ve Faz 3 bildirim kod dilimi tamamlandı. GPS yenileme, Android Expo Go izin/fallback akışı, küçük ekran ve büyük yazı kontrolleri de tamamlandı. Sıradaki ürün fazı aylık takvim ve Ramazan imsakiyesidir. iOS development build, gerçek TalkBack/VoiceOver ve çoklu Diyanet karşılaştırması release doğrulama kapıları olarak ayrıca yürütülecektir.

## Faz 3 durumu

Saf bildirim planlayıcı, en fazla 60 olaylık kuyruk, gerçek pending listeyle idempotent uzlaştırma, v3 state migration, genel/per-vakit tercihler, ön hatırlatma, ses seçimi, bildirim ayarları ve yardım ekranı eklendi. Android 16 / Expo Go 57.0.9'da gerçek izin diyaloğu, 60 olaylık pending kuyruk ve uygulama arka plandayken üç saniyelik teslim doğrulandı. Expo Go'nun push girişi ve kanal yöneticisi SDK 57'de çalışmadığı için yalnız bu geliştirme ortamında yerel alt modüller ile varsayılan kanal kullanılır; production build public paket girişi ve Vakit kanallarını kullanır. Özel ses/sessiz kanal, kesin alarm, reboot/force-stop, iOS ve gerçek cihaz testleri yapılmadan Faz 3 `v0.3.0` sayılmaz.

## Tamamlandı

- 37 Stitch ekranı analiz edildi; 19 Home varyasyonu tek Home/tema sisteminde toplandı. İki tasarım klasörü korunuyor.
- Expo 57.0.26, RN 0.86.3, React 19.2.3, Router, strict TS, Node 24 LTS ve lockfile.
- 81 il + 974 GeoNames ilçe kaydıyla offline arama/onay; foreground GPS, ret/timeout ve manuel fallback.
- Adhan provider, UTC olaylar, seçili Türkiye saat dilimi, vakit düzeltme altyapısı, dün/bugün/yarın ve Yatsı sonrası İmsak.
- Foreground sayaç, GPS konumu için arka plandan dönüşte izin istemeden yenileme, tek Home, altı gerçek vakit, kaynak modalı, dört mevsim/dört faz/Ramazan tema resolver'ı ve temel görünüm seçimi.
- SQLite KV kalıcılık, bozuk kayıt kurtarma, async GPS yarış koruması; web incelemede localStorage.
- 2026–2027 Hicri ay başlangıçları, kapsam dışı açık kaynaklı hesaplanan fallback, Ramazan sınırları.
- Üç adımlı onboarding; genel ayarlar merkezi; altı vakit için ±30 dakika düzeltme; ±2 günlük Hicri düzeltme ve canlı önizleme. Eski v1 kayıtları v2 şemasına göç eder; kayıtlı konumu olan kullanıcı onboarding'i tekrar görmez.
- Faz 3 bildirim tercihleri ve saf planlama altyapısı; özgün kısa Vakit tonu, sistem sesi ve sessiz seçenekleri. State v3'e göç eder.
- 42 test, üç host saat diliminde 22 ek test, lint/typecheck ve Expo Doctor 21/21. Ayrıntılar VALIDATION.md.

## İlk dilimde açık kalan doğrulamalar

- Gerçek iOS development build ve iOS izinleri hâlâ release kapısıdır. Android Expo Go’da izin diyaloğu, ret/fallback ve izin sonrası konum isteği; 720×1280 ekran ve 1.3 font ölçeği doğrulandı. Emülatör sağlayıcısı sabit GPS fix vermediği için Android GPS başarı sonucu timeout ile sınırlı kaldı. TalkBack servisi emülatörde kurulu değildi; native accessibility rolleri ve birleşik etiketler test edildi. İstenmeden başlatılan native build tamamlanmadan durduruldu; `android/`, `dist/` ve eklenen paket/config değişiklikleri temizlendi. Kullanıcı açıkça istemeden APK/prebuild yapma.
- Diyanet yalnız İstanbul tek gün karşılaştırıldı (0–2 dk fark); yedi şehir/mevsimler/Ramazan matrisi tamamlanmadan üretim uyumu iddia edilmez.
- GeoNames resmî ilçe kapsamı, 29 yaklaşık temsil koordinatı. 974 kayıt sayısı resmî güncel ilçe sayısı iddiası değildir.
- npm audit iki transitif advisory nedeniyle 14 moderate: uyumlu çözüm release öncesi; uyumsuz downgrade/force uygulanmadı.
- Tema renkleri merkezidir; halka/ilk görünüm animasyonu var. Tüm paletler arasında renk interpolasyonu henüz yok. Türkçe çekirdek sözlük var; bazı ekran metinlerinin tam i18n ayrımı İngilizce aşamasında.

## Home sonrasında

1. Faz 3 production doğrulama kapısı: development build açıkça yetkilendirildiğinde Android/iOS özel ses ve sessiz kanal, kesin alarm, reboot/force-stop, ekran kilidi ve gerçek cihaz davranışını test et; sonuçlar geçerse `v0.3.0` oluştur.
2. Faz 4: aylık takvim ve Ramazan imsakiyesi. Faz 3 native kapısı ayrı izlenebilir; ürün geliştirmesi kullanıcı tercihiyle Faz 4'e geçebilir.
3. Faz 5: Kıble ve sensörsüz/kalibrasyon durumları.
4. Faz 6: gizlilik/lisans ekranı, ikon/splash, mağaza kimlikleri, erişilebilirlik ve release build.

Hesap, reklam, backend, widget, tam ezan, PDF, mukabele ve zikirmatik kapsam dışı. Remote/push/yayınlama yapılmadı.

## Devam komutları

Node 24 ile `npm run check`, `npm run test:timezones`, `npx expo-doctor`. Çalıştırma README'de. Android emülatör incelemesi için Metro'yu `npm start -- --lan` ile açıp Expo Go kullan. `npm run android`, prebuild ve APK/AAB ancak kullanıcı açıkça isterse.

## Oturum devri

- Git düzeni `docs/VERSIONING.md` içindedir: `main` doğrulanmış/tag'li kilometre taşları, `develop` aktif entegrasyon, gerektiğinde `feature/*` ve `fix/*`. İlk geri dönüş noktası `v0.1.0`; sonraki çalışma `develop` üzerinde sürer. Remote henüz yapılandırılmadı.
- İlk okunacak dosyalar: `AGENTS.md`, ardından bu dosya. Tasarım ayrıntısı gerekirse `docs/DESIGN.md`; teknik karar gerekirse `docs/ARCHITECTURE.md`; kanıt ve açık kontroller için `docs/VALIDATION.md`.
- Son doğrulanan çalışma biçimi: Android 16 Pixel 7 emülatörü, Expo Go 57.0.9, LAN Metro `8081`; Home ve offline konum listesi açıldı. Metro süreçleri oturumlar arasında kalıcı kabul edilmez.
- Faz 2 `feature/phase2-onboarding-settings` dalında tamamlandı: onboarding, genel ayarlar, hesaplama düzeltmeleri ve Hicri düzeltme eklendi. Android Expo Go'da ayarlar navigasyonu, İmsak +1'in Home'a anında yansıması, “1 düzeltme” özeti, Hicri +1 canlı önizlemesi ve değerleri yeniden sıfırlama doğrulandı.
- Faz 3 `feature/phase3-local-notifications` dalında geliştirildi ve oturum sonunda `develop` ile birleştirildi: `expo-notifications`, saf planlayıcı/uzlaştırma, v3 migration, ayarlar ve yardım ekranları eklendi. Android Expo Go'da izin diyaloğu, 60 pending olay ve arka planda üç saniyelik test teslimi doğrulandı; özel kanal ve özel ses Expo Go kapsamı dışındadır.
- Şu an yapılacak iş: kullanıcı development build'i ayrıca isterse Faz 3 production native doğrulama kapısını yürüt; bu kapı geçmeden `v0.3.0` etiketi oluşturma. Ürün geliştirmesinde sıradaki iş Faz 4 aylık takvim/Ramazan imsakiyesidir.
- `android/` ve `dist/` mevcut değil; APK/AAB yok. `expo-system-ui` kaldırıldı ve `app.json` prebuild öncesi durumuna döndü.

Yeni oturumda AGENTS.md ve bu dosyayı oku; tüm tasarımları tekrar tarama. Mimari/kaynak/validasyon belgelerinin yalnız gerekli bölümünü aç.
