# Devam noktası — 2 Ekim 2026

Kullanıcı geliştirmeyi onayladı. Repository kökünde Faz 1 ve Faz 2 çalışan durumda. **Faz 3 yerel bildirimlerin kodu ile Android Expo Go doğrulama dilimi tamamlandı; production native doğrulama kapısı açık.** Development build/APK üretme; kullanıcı daha önce yalnız Expo Go istemişti.

## Faz 1–2 durumu

İlk dikey dilim ile Faz 2 onboarding/ayarlar, Faz 3 bildirim kodu, Faz 4 takvim, Faz 5 Kıble ve Faz 6 yayın yüzeyi tamamlandı. GPS yenileme, Android Expo Go izin/fallback akışı, küçük ekran ve büyük yazı kontrolleri de tamamlandı. Ürün yalnız Android/Play Store hedeflidir; iOS ve App Store kapsam dışıdır. Galaxy A52'de ilk açılış, Kâğıthane GPS seçimi ve Kıble pusulasının temel başarı yolu geçti. Takvim/tema gecikmeleri için hesap önbelleği, boşta hesaplama, arka plan ekran dondurma ve daha kısa geçiş uygulandı; A52 yeniden kabulü açık. Bildirim durumu ekranındaki `Son plan` etiketi hâlâ düzeltilmelidir. Açık yetki verilirse Android production bildirim ve release build kapıları gelir. Gerçek TalkBack ve çoklu Diyanet karşılaştırması ayrıca yürütülecektir.

## Faz 3 durumu

Saf bildirim planlayıcı, en fazla 60 olaylık kuyruk, gerçek pending listeyle idempotent uzlaştırma, v3 state migration, genel/per-vakit tercihler, ön hatırlatma, ses seçimi, bildirim ayarları ve yardım ekranı eklendi. Android 16 / Expo Go 57.0.9'da gerçek izin diyaloğu, 60 olaylık pending kuyruk ve uygulama arka plandayken üç saniyelik teslim doğrulandı. Expo Go'nun push girişi ve kanal yöneticisi SDK 57'de çalışmadığı için yalnız bu geliştirme ortamında yerel alt modüller ile varsayılan kanal kullanılır; production build public paket girişi ve Vakit kanallarını kullanır. Özel ses/sessiz kanal, kesin alarm, reboot/force-stop, Doze/pil tasarrufu ve gerçek Android cihaz testleri yapılmadan Faz 3 `v0.3.0` sayılmaz.

## Faz 4 durumu

Native Takvim ekranı eklendi. Aylık Miladi görünüm, seçili gün özeti, yatay tüm vakit tablosu, Ramazan görünümü, 2026–2027 kaynaklı Ramazan aralığı ve kapsam dışı yıllar için Umm al-Qura fallback'i çalışıyor. Hicri gösterim düzeltmesi tabloya uygulanıyor; saatler `PrayerTimesProvider` üzerinden gerçek konum verisiyle hesaplanıyor. Expo Go Android emülatöründe Ekim 2026 aylık görünüm ve 1448 Ramazan 29 günlük imsakiyesi açıldı.

## Faz 5 durumu

Kıble ekranı eklendi. Seçili konumdan Kâbe'ye büyük çember başlangıç doğrultusu ve kuş uçuşu mesafe cihazda hesaplanıyor. Expo Location başlık adaptörü gerçek kuzey, manyetik kuzey ve hassasiyet durumunu ayırıyor; sensör veya izin yokken statik gerçek-kuzey açısı gösteriliyor. Android 16 Pixel 7 emülatörü / Expo Go 57.0.9'da Mesudiye için 174° ve yaklaşık 2.125 km sensörsüz durum açıldı. Fiziksel cihaz pusulası, izin ve kalibrasyon davranışı henüz doğrulanmadı.

## Tamamlandı

- 37 Stitch ekranı analiz edildi; 19 Home varyasyonu tek Home/tema sisteminde toplandı. İki tasarım klasörü korunuyor.
- Expo 57.0.26, RN 0.86.3, React 19.2.3, Router, strict TS, Node 24 LTS ve lockfile.
- 81 il + 974 GeoNames ilçe kaydıyla offline arama/onay; foreground GPS, ret/timeout ve manuel fallback.
- Adhan provider, UTC olaylar, seçili Türkiye saat dilimi, vakit düzeltme altyapısı, dün/bugün/yarın ve Yatsı sonrası İmsak.
- Foreground sayaç, GPS konumu için arka plandan dönüşte izin istemeden yenileme, tek Home, altı gerçek vakit, kaynak modalı, dört mevsim/dört faz tema resolver'ı ve otomatik/isteğe bağlı özel Ramazan paleti ile hilal/yıldız dekoru.
- SQLite KV kalıcılık, bozuk kayıt kurtarma, async GPS yarış koruması; web incelemede localStorage.
- 2026–2027 Hicri ay başlangıçları, kapsam dışı açık kaynaklı hesaplanan fallback, Ramazan sınırları.
- Üç adımlı onboarding; genel ayarlar merkezi; altı vakit için ±30 dakika düzeltme; ±2 günlük Hicri düzeltme ve canlı önizleme. Eski v1 kayıtları v2 şemasına göç eder; kayıtlı konumu olan kullanıcı onboarding'i tekrar görmez.
- Faz 3 bildirim tercihleri ve saf planlama altyapısı; özgün kısa Vakit tonu, sistem sesi ve sessiz seçenekleri. State v3'e göç eder.
- Faz 4 aylık takvim ve Ramazan imsakiyesi: tek ekran, iki görünüm ve provider enjeksiyonu.
- Faz 5 Kıble: saf yön/mesafe domain'i, gerçek-kuzey/manyetik-kuzey ayrımlı başlık adaptörü, sensörsüz durum, native pusula ekranı ve navigasyon erişimi.
- Faz 6 yayın yüzeyi: native splash arka planı ve font yükleme marka yüzeyi, Hakkında/Gizlilik/Kaynak/Lisans ekranı, Ayarlar erişimi ve Android Play Store ikonları. Kullanıcının sağladığı hilal-pusula ikonu beyaz köşeleri temizlenerek standart ve adaptive PNG'lere dönüştürüldü; iOS kapsam dışı.
- 61 test, üç host saat diliminde 28 ek test, lint/typecheck ve Expo Doctor 21/21. Ayrıntılar VALIDATION.md.

## İlk dilimde açık kalan doğrulamalar

- Android Expo Go’da izin diyaloğu, ret/fallback ve izin sonrası konum isteği; 720×1280 ekran ve 1.3 font ölçeği doğrulandı. Emülatör sağlayıcısı sabit GPS fix vermediği için Android GPS başarı sonucu timeout ile sınırlı kaldı. TalkBack servisi emülatörde kurulu değildi; native accessibility rolleri ve birleşik etiketler test edildi. İstenmeden başlatılan native build tamamlanmadan durduruldu; `android/`, `dist/` ve eklenen paket/config değişiklikleri temizlendi. Kullanıcı açıkça istemeden APK/prebuild yapma.
- Diyanet yalnız İstanbul tek gün karşılaştırıldı (0–2 dk fark); yedi şehir/mevsimler/Ramazan matrisi tamamlanmadan üretim uyumu iddia edilmez.
- GeoNames resmî ilçe kapsamı, 29 yaklaşık temsil koordinatı. 974 kayıt sayısı resmî güncel ilçe sayısı iddiası değildir.
- npm audit iki transitif advisory nedeniyle 14 moderate: uyumlu çözüm release öncesi; uyumsuz downgrade/force uygulanmadı.
- Tema renkleri merkezidir; halka/ilk görünüm animasyonu ve manuel/otomatik palet değişiminde 320 ms eski→yeni gradient çapraz geçişi ile 280 ms hafif içerik perdesi var. Beyaz-gri ara flaş emülatörde görülmedi; fiziksel A52'de geçiş akıcılığı yeniden kontrol edilecek. Türkçe çekirdek sözlük var; bazı ekran metinlerinin tam i18n ayrımı İngilizce aşamasında.

## Home sonrasında

1. Faz 3 production doğrulama kapısı: development build açıkça yetkilendirildiğinde Android özel ses ve sessiz kanal, kesin alarm, Doze/pil tasarrufu, reboot/force-stop, ekran kilidi ve gerçek cihaz davranışını test et; sonuçlar geçerse `v0.3.0` oluştur.
2. Faz 4 cihaz/ürün kontrolleri: farklı aylar, Hicri düzeltme, Ramazan seçimi, küçük ekran yatay tablo ve veri kapsamı dışı fallback.
3. Faz 5 fiziksel cihaz doğrulaması: gerçek-kuzey/manyetik ayrımı, izin reddi/izin verme, hareket/kalibrasyon, uygulamadan çıkışta abonelik temizliği.
4. Faz 6 release kapısı: Android native splash ve adaptive launcher maskesi, Play Store önizlemesi, uygulama kimliği, imzalama ve release build.

Hesap, reklam, backend, widget, tam ezan, PDF, mukabele ve zikirmatik kapsam dışı. Remote/push/yayınlama yapılmadı.

## Devam komutları

Node 24 ile `npm run check`, `npm run test:timezones`, `npx expo-doctor`. Çalıştırma README'de. Android emülatör incelemesi için Metro'yu `npm start -- --lan` ile açıp Expo Go kullan. `npm run android`, prebuild ve APK/AAB ancak kullanıcı açıkça isterse.

## Oturum devri

- 2 Ekim 2026 tema akıcılığı devamı: Kullanıcı hızlanan geçişin bir anda renk değiştirdiğini belirtti. Önceki gradient ve dekor yeni opak paletin üzerinde 320 ms sönecek biçimde gerçek çapraz geçiş eklendi; kart/metin renk sıçraması 280 ms düşük opaklıklı üst perdeyle maskelendi. Hareketi azalt tercihi hâlâ geçişi sıfırlar. Pixel 7 emülatörü / Expo Go'da Kış→İlkbahar→otomatik mevsim ara kareleri kontrol edildi; beyaz flaş ve fatal/RN hata yoktu. A52 kullanıcı kabulü açık. Takvim önbellekleri yalnız RAM'de, 12 tablo ve 400 günle sınırlı LRU'dur; uygulama süreci kapanınca temizlenir.

- 2 Ekim 2026 fiziksel A52 geri bildirimi ve performans düzeltmesi: Kullanıcı Expo Go'da ilk açılış marka ekranını, Kâğıthane GPS seçimini ve çalışan Kıble pusulasını doğruladı; Takvim route'u, Aylık/Ramazan ve ay geçişleri ile tema seçimlerinde gecikme bildirdi. Takvim hesabı ilk ekran karesinden sonra boşta çalışacak ve kısa yükleniyor yüzeyi gösterecek biçimde ayrıldı; son 12 tablo ve son 400 Adhan gün hesabı sınırlı LRU önbelleğe alındı. Tema bağımlılıkları daraltıldı, odakta olmayan Stack ekranları donduruldu ve koyu perde 520→240 ms oldu. Pixel 7 emülatörü / Expo Go'da sekme ve Ekim→Kasım başlığı yaklaşık 100 ms karede değişti, hesap 1 saniyenin altında tamamlandı; tema Kış geçişi 340 ms karede tamamlandı, fatal/RN hata yoktu. `npm run check` 61/61 ve üç host saat dilimi 28/28 geçti. A52'de performansın yeniden kabulü açık; Metro geçici süreçtir.

- 2 Ekim 2026 test hazırlığı: Metro `npm start -- --lan` ile `exp://192.168.1.118:8081` adresinde Expo Go modunda çalışıyor; `Pixel_7 (emulator)` Expo CLI üzerinden açıldı ve bundle yükleniyor. Expo cihaz seçicisinde fiziksel A52 görünmediği için A52 otomatik başlatılamadı; aynı ağdaki A52’de Expo Go içinden QR/proje adresiyle açılması gerekiyor. Metro geçici oturumdur, sonraki oturumda çalışıyor varsayılmamalı.

- 2 Ekim 2026 fiziksel cihaz öncesi emülatör kabul kontrolü: Android 16 Pixel 7 / Expo Go 57.0.9 soğuk başlatmada Home, konum, takvim/Ramazan, Kıble fallback'i, görünüm/Ramazan teması, vakit ve Hicri düzeltmeleri, bildirimler/durum ve Hakkında akışları tekrarlandı. Bildirim kuyruğu kapat/aç ile 60→0→60 oldu; Expo Go force-stop sonrası konum/tercihler ve 60 olay geri geldi, fatal/RN hata logu yoktu. Tema geçiş karelerinde beyaz flaş görülmedi. Emülatör GPS'i sentetik fix'e rağmen timeout oldu; fallback doğru. Tek UX bulgusu, kuyruğun son olay tarihini gösteren `Son plan` metninin belirsiz olmasıdır. `npm run check` 60/60, üç host saat dilimi 27/27 ve Expo Doctor 21/21 geçti; native build üretilmedi.
- 2 Ekim 2026 bildirim yenileme sağlamlaştırması: Açılış, foreground veya tercih/konum değişikliklerinin üst üste gelmesi artık paralel native uzlaştırma başlatmıyor. Tek çalışan işlem korunuyor; bekleyen ara durumlar atlanıp en güncel anlık görüntü bir sonraki turda uygulanıyor. Kuyruk hata sonrası yeni işi kabul ediyor. `npm run check` geçti (60 Jest, strict typecheck, ESLint); üç host saat diliminde 27/27 test geçti. Native build üretilmedi.
- 1 Ekim 2026 platform kapsamı: Kullanıcı ürünün yalnız Android/Play Store hedefleyeceğini, iOS ve App Store sürümü olmayacağını netleştirdi. iOS release/doğrulama kapıları plandan çıkarıldı; `npm run export` Android bundle ile sınırlandı, iOS script/config kaldırıldı. Expo ortak platform dalları çalışma riski yaratmamak için kaynakta kalabilir, ancak ürün hedefi sayılmaz.
- 1 Ekim 2026 Ayarlar ikon düzeltmesi: Alt navigasyondaki güneş gibi görünen eski Ayarlar çizimi merkez delikli dişli SVG ile değiştirildi; Home, Takvim ve Kıble alt barlarında aynı `settings` ikonu kullanılıyor. Android Expo Go güncel bundle'ında görsel kontrol yapıldı; `npm run check` ve saat dilimi kontrolleri geçti, native build üretilmedi.
- 1 Ekim 2026 Ramazan Home odağı: Gerçek Ramazan aralığında ana halka gece/sahur döneminde “İmsaka kalan süre”, oruç döneminde “İftara kalan süre” gösteriyor. Sahur/İmsak ve İftar/Akşam kartlarına ilgili günün saati ile kalan/geçen durumu eklendi; normal sıradaki namaz farklıysa ikincil bilgi olarak korunuyor. Ramazan dışı “Her zaman açık” yalnız temayı önizliyor. `npm run check` geçti (58 Jest, strict typecheck, ESLint); native build üretilmedi.
- 1 Ekim 2026 Ramazan atmosferi geliştirmesi: Daha önce yalnız altın vurguya yakın kalan görünüm, merkezi tema içinde ayrı gündüz/gece paletleri ve düşük opaklıklı hilal/yıldız dekoruyla belirginleştirildi. Varsayılan `Ramazan’da otomatik` gerçek Ramazan aralığında kendiliğinden açılır; kullanıcı `Kapalı` ile devre dışı bırakabilir, `Her zaman açık` ile Ramazan dışında yalnız görünümü önizleyebilir. Android Expo Go'da gündüz ve gece önizlemeleri kontrol edildi, takvim/tarih değişmedi ve emülatör varsayılan otomatik ayara döndürüldü. `npm run check` geçti (56 Jest, strict typecheck, ESLint); native build üretilmedi.
- 1 Ekim 2026 tema geçişi ve metin düzeltmesi: Manuel görünüm seçimi ile 15 saniyelik otomatik güneş fazı güncellemesi aynı 520 ms koyu perde geçişini kullanıyor; açık/koyu gradientlerin beyaz-gri ara flaşı giderildi, açık ekran yeniden kurulmadan korunuyor ve hareketi azalt tercihine uyuluyor. Görünüm ekranında doğuş/batış eşikleri açıklandı. Konum kök listesi “81 il”, alt liste “ilçe”, arama “sonuç” gösteriyor. Android Expo Go'da manuel Gün batımı → Gündüz geçişi ara karelerle tekrarlandı; beyaz flaş görülmedi. `npm run check` (55 Jest) geçti. Native build üretilmedi. Sıradaki somut iş fiziksel Android cihazda Kıble yön sensörü, izin ve kalibrasyon doğrulamasıdır.
- 1 Ekim 2026 görünüm tercihi: Işık bölümüne manuel Şafak, Gündüz, Gün batımı ve Gece seçenekleri eklendi. Seçim mevcut v3 `appearance` alanında saklanır; resolver seçilen fazı ve Home etiketini saatten bağımsız sabitler. `npm run check` ve üç host saat dilimi testi geçti (54 Jest, host başına 26 ilgili test); native build üretilmedi.
- Işık seçenekleri sadeleştirildi: Cihaz teması, Her zaman aydınlık ve Her zaman karanlık UI'dan kaldırıldı. Eski kayıtlar solar/day/night eşlemesiyle korunuyor; kullanıcıya yalnız otomatik veya dört manuel güneş fazı sunuluyor.
- 1 Ekim 2026 Işık sadeleştirme doğrulaması: Android Expo Go güncel bundle'ında dört manuel faz ve otomatik seçenek cihaz ekranında göründü; üç tekrarlı ışık seçeneği görünmüyor. `npm run check` ve saat dilimi testleri geçti (55 Jest, host başına 26 ilgili test).
- Expo Go görünüm kontrolü: 8081 Metro yeniden başlatılıp güncel bundle açıldı; Ayarlar → Görünüm → Işık ekranında dört manuel faz seçeneği cihazda göründü. Önceki görünmeme durumu eski/cache bundle kaynaklıydı.
- 1 Ekim 2026 Takvim UI düzeltmesi: seçili ilk gün satırı ile `TARİH/İMSAK/...` başlığının aynı highlight zemini kullanması nedeniyle oluşan çizgi belirsizliği giderildi. Başlık nötr yüzeye ve ince alt çizgiye alındı. `npm run check` geçti (48 test, typecheck, lint); native build üretilmedi.
- 1 Ekim 2026 Faz 4 kontrol oturumu: `npm run check` ve `npm run test:timezones` tekrar çalıştırıldı; 48 Jest testi, 22 saat dilimi testi, strict typecheck ve ESLint geçti. CUA emülatör penceresini hedefleyemediği için cihaz kontrolü ADB/uiautomator ve emülatör ekranı üzerinden sürdürüldü; native build üretilmedi.
- Aynı oturumda ADB/uiautomator ve emülatör ekranı üzerinden Faz 4'ün Ekim→Kasım geçişi, Ramazan görünümü, Hicri +1→0 düzeltmesi ve 720×1280 yatay tablo kontrolü tamamlandı. 2030 fallback'i UI'da yıl seçicisi olmadığı için yalnız domain testiyle kanıtlı; gerçek cihaz ve UI fallback kontrolü açık.
- Git düzeni `docs/VERSIONING.md` içindedir: `main` doğrulanmış/tag'li kilometre taşları, `develop` aktif entegrasyon, gerektiğinde `feature/*` ve `fix/*`. İlk geri dönüş noktası `v0.1.0`; sonraki çalışma `develop` üzerinde sürer. Remote henüz yapılandırılmadı.
- İlk okunacak dosyalar: `AGENTS.md`, ardından bu dosya. Tasarım ayrıntısı gerekirse `docs/DESIGN.md`; teknik karar gerekirse `docs/ARCHITECTURE.md`; kanıt ve açık kontroller için `docs/VALIDATION.md`.
- Son doğrulanan çalışma biçimi: Android 16 Pixel 7 emülatörü, Expo Go 57.0.9, LAN Metro `8081`; Home ve offline konum listesi açıldı. Metro süreçleri oturumlar arasında kalıcı kabul edilmez.
- Faz 2 `feature/phase2-onboarding-settings` dalında tamamlandı: onboarding, genel ayarlar, hesaplama düzeltmeleri ve Hicri düzeltme eklendi. Android Expo Go'da ayarlar navigasyonu, İmsak +1'in Home'a anında yansıması, “1 düzeltme” özeti, Hicri +1 canlı önizlemesi ve değerleri yeniden sıfırlama doğrulandı.
- Faz 3 `feature/phase3-local-notifications` dalında geliştirildi ve `develop` ile birleştirildi: bildirim planlayıcı/uzlaştırma, ayarlar ve yardım ekranları.
- Faz 4 Takvim ekranı ve Faz 5 Kıble tamamlandı. Faz 6 `feature/phase6-release` dalında geliştirildi: Hakkında/Gizlilik/Kaynak/Lisans ekranı, Ayarlar bağlantısı, temalı native splash, font yüklenirken marka yüzeyi ve Android ikonları eklendi. Adaptive icon Expo config ve emülatör Metro bundle akışıyla kontrol edildi; native release build, launcher maskesi ve Play Console yüklemesi hâlâ açık kapıdır.
- `android/` ve `dist/` mevcut değil; APK/AAB yok. `expo-system-ui` kaldırıldı ve `app.json` prebuild öncesi durumuna döndü.

Yeni oturumda AGENTS.md ve bu dosyayı oku; tüm tasarımları tekrar tarama. Mimari/kaynak/validasyon belgelerinin yalnız gerekli bölümünü aç.
