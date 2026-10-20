# Faz 1–6 doğrulaması — 6 Ekim 2026

## 14 Ekim 2026 — Dahili testte gerçek vakit bildirimi teslim edilmedi

- Kullanıcı Galaxy A52'ye Play Console dahili testindeki `0.3.0-rc.1 (1)` sürümünü kurdu. Android bildirim izni açıkken uygulamanın 3 saniyelik test bildirimi teslim edildi.
- Aynı kurulumda etkin **vakit zamanında** ve **15 dakika önce** bildirimleri teslim edilmedi. Expo Go altında daha önce planlanan yerel bildirimler ise gelmeye devam ediyor.
- Kod incelemesine göre test bildirimi `TIME_INTERVAL` ile 3 saniye sonrasına, gerçek vakitler `DATE` tetikleyicisiyle Android AlarmManager'a kaydediliyor. Expo Go (`host.exp.exponent`) ile Vakitname (`com.alemdem.vakitname`) ayrı paketlerdir; bildirim izni, kesin alarm özel erişimi, kanal ve bekleyen alarm kuyrukları paylaşılmaz.
- Vakitname target SDK 36'dır ve `SCHEDULE_EXACT_ALARM` bildirir. Android 14 ve üzerindeki yeni kurulumlarda bu özel erişim varsayılan verilmez. SDK 57, erişim yokken tarih tetikleyicisini `setAndAllowWhileIdle` yaklaşık alarmına düşürür; A52'de aynı yolun daha önce 7–18 dakika geciktiği ölçülmüştür. Bu nedenle ilk teşhis Vakitname paketinde **Alarmlar ve hatırlatıcılar** erişiminin kapalı olması ve Samsung'un yaklaşık alarmı geciktirmesi/atlamasıdır.
- Bu turda telefon ADB'ye bağlı değildi; `com.alemdem.vakitname` app-op durumu, gerçek pending alarm sayısı, force-stop/uyku durumu ve teslim logu okunamadı. Dolayısıyla teşhis güçlü fakat henüz cihaz kanıtlı kesin kök neden değildir.
- Yeniden kabul: Bildirimler ekranında bekleyen Vakitname sayısını kaydet; **Sistem ayarını aç** ile Vakitname'ye özel kesin alarm erişimini aç; uygulamaya geri dönüp planın zorla yeniden kurulmasını bekle; ardından gerçek 15 dakika/vakit-anı teslimini kontrol et. Başarısızsa ADB ile app-op, AlarmManager ve notification dump alınarak Samsung pil kısıtı/force-stop ayrıştırılmalıdır.

## 6 Ekim 2026 — Vakitname, EAS ve mağaza yapılandırması

- Cihazdaki ve Play Store'daki görünen ad **Vakitname**, Android kimliği `com.alemdem.vakitname` ve ilk `versionCode` değeri `1` olarak sabitlendi. Eski yerel veri/bildirim kimlikleri yükseltme uyumu için korundu.
- Expo hesabında `@alemdem/vakitname` projesi oluşturuldu ve `e5365686-2c53-4aab-9277-c5989561eea5` kimliğiyle bağlandı. EAS CLI, development ve production profillerini çözdü: development iç dağıtım APK/development client, production Play AAB; kanallar sırasıyla `development`, `preview`, `production` ve Android runtime politikası `appVersion`.
- EAS Update için gizlilik metni, uygulamadaki Hakkında özeti, Play Veri Güvenliği taslağı, Netlify statik HTML'i ve arşiv PDF'i güncellendi. Konum/vakit/tercih verilerinin gönderilmediği; Expo'nun IP/ağ, işletim sistemi, rastgele update belirteci ve hata/kullanım/performans verisi işleyebileceği açıklandı.
- Gizlilik HTML'i yerel HTTP üzerinden 390×844 telefon viewport'unda açıldı: `scrollWidth === clientWidth`, sıfır script, doğru başlık/hiyerarşi, Expo ve e-posta bağlantıları doğrulandı. Güncel içerik henüz canlı Netlify alanına yeniden yüklenmedi.
- PDF yeniden üretildi ve üç sayfanın tamamı PNG'ye render edilerek görsel incelendi; taşma/kesilme, eski marka veya eski “hiçbir teknik veri aktarılmaz” iddiası görülmedi. Metin çıkarımı Vakitname ve EAS Update açıklamasını doğruladı.
- Kullanıcı, Play geliştirici hesabının Eylül 2026'da açıldığını doğruladı. Kişisel hesap akışında 12 test kullanıcısının 14 gün kesintisiz katıldığı kapalı test release planına zorunlu kapı olarak eklendi.
- Node 24.21.0 ile strict TypeScript, ESLint ve 10 suite / 88 Jest testi; üç host saat diliminde 28/28; `expo install --check`; Expo Doctor 21/21 geçti. Android Hermes export 1866 modül ve 35 asset ile geçici dizine üretildi. EAS CLI development ve production profillerini hatasız çözdü.
- Bu yapılandırma turunda OTA update, APK veya AAB yayımlanmadı; native davranış ve gerçek AAB manifesti hâlâ cihaz/release kabulü gerektirir.

## 5 Ekim 2026 — Günlük arka plan bildirim yenilemesi

- Node 24.21.0 ile strict TypeScript, ESLint ve 10 Jest suite / **88 test** geçti. Yeni 12 test: UI açılmadan ufkun ertesi güne uzaması (150 olay, yeni gün için 10 yeni kimlik), izin/tercih kapatma ve görev kaldırma, konumsuz/etkin türsüz durum, bozuk/eksik state'te kuyruğu koruma, güncel bellekteki tercihin eski SQLite kaydına üstünlüğü, seri foreground/headless erişim, hatadan toparlanma, uzun aradan sonra geçmiş olayları göndermeme, günlük kaydı tekrar kurmama ve Expo Go/sistem kısıtı davranışı.
- Üç host saat diliminde ilgili 28/28 test geçti; `npx expo install --check` uyumlu. `index.js` girişinden Android JS/Hermes export 1866 modülle tamamlandı; çıktı repository dışındaki geçici klasördedir. Bu native APK/AAB veya cihaz kabulü değildir.
- `expo-background-task ~57.0.21` Android kaynağında ağ koşulu `NetworkType.CONNECTED`; JS seçenekleri yalnız minimum aralığı sağlar. Hesaplama ve hazır bildirimler offline olsa da otomatik görev ağ bağlantısını bekler. `expo-task-manager` Android Expo Go'da kullanılamaz; uygulama bu ortamda kayıt yapmaz ve UI bunu belirtir.
- Performans tasarımı: minimum 24 saat, en fazla 15 gün/180 olay, pending farkıyla ekleme/silme, GPS/sensör/HTTP isteği/JS interval/sürekli servis yok. Gerçek pil tüketimi, OS'nin otomatik headless çalıştırması, 24 saat/15 gün devamlılık, reboot/Doze/force-stop henüz native cihazda ölçülmedi; release kapısı açık.
- Güncel `npm audit` 61 bulgu (50 high, 11 moderate, 0 critical) raporladı. Önceki 14 moderate kaydı güncel değildir. Paket eklemesi lockfile'a 31 satır ekledi; bu tur güvenlik güncellemesi veya `audit fix --force` uygulamadı. Release öncesi bağımlılık incelemesi açık.

## 3 Ekim 2026 — Stitch splash uygulaması

- `Splash Ekranı` / `Splash - Gün Batımı Cam Efekt` Stitch referansı native React Native bileşenlerine eşlendi; mevcut uygulama ikonu kullanıldı, yeni görsel veya uzaktan runtime bağımlılığı eklenmedi.
- Referanstaki alıntı Diyanet İşleri Başkanlığı'nın İsrâ 78. ayet sayfasıyla doğrulandı. Tasarımdaki “Güneşin batışından...” başlangıcı resmî meal ile birebir eşleşmediği için, kaynakta geçen “Gündüzün güneşin gün ortasını aşmasından...” başlangıçlı Kur'an Yolu meali sure/ayet atfıyla eklendi. Kaynak kaydı `DATA-SOURCES.md` içindedir.
- `npm run check` geçti: strict TypeScript, ESLint ve 8 Jest paketi / 61 test başarılı.
- Metro üzerinden Android bundle yenilendi; bundle derlemesi başarıyla tamamlandı. Kontrol anında A52 kilit ekranındaydı, bu nedenle yeni JavaScript splash'in kısa görünme süresi kare bazlı kabul edilemedi.
- Sınır: Expo Go mevcut native splash yapılandırmasını yeniden üretmez. `app.json` içindeki statik başlangıç rengi/ikon yalnız yeni native binary veya development build'de doğrulanabilir; kullanıcı istemediği için build/prebuild yapılmadı.

### 3 Ekim 2026 — Pixel 7 Expo Go splash görsel kabulü

- Pixel 7 emülatörü sıfır snapshot ile yeniden başlatıldı; Expo Go zorla kapatılıp `exp://127.0.0.1:8081` üzerinden soğuk açılış yapıldı.
- Expo Go'nun kendi beyaz başlangıç katmanından sonra uygulamanın JavaScript splash'i ekran görüntüsünde doğrulandı: gün batımı gradienti, uygulama ikonu, `VAKİT`, alt slogan, İsrâ 78 ayet metni/atıfı, İstanbul silüeti ve animasyonlu altın yükleme çizgisi görünür.
- İlk kontrolde fontların önbellekten çok hızlı gelmesi nedeniyle bu katman bir kareden kısa sürdü. `RootLayout` içinde minimum 900 ms görünürlük eklendi; ikinci soğuk açılışta yüzey net biçimde yakalandı ve ardından Home/Kâğıthane sayacına geçti.
- Logcat taramasında `FATAL EXCEPTION`, React Native JavaScript hata, `Invariant Violation`, `TypeError` veya bundle çözümleme hatası bulunmadı. `npm run check` 61/61 geçti.
- Sınır: Görülen beyaz Expo Go katmanı uygulamanın native splash'i değildir. `app.json` içindeki ikon/`#0E1324` statik katmanını doğrulamak için development/release binary gerekir.

## 3 Ekim 2026 — Samsung Galaxy A52 fiziksel Expo Go kabul turu

Kapsam: `SM-A525F` / `a52q`, Android fiziksel cihaz, Expo Go + LAN Metro. ADB hedefi `192.168.1.109:39759`; Pixel 7 emülatörü ayrıca bağlıydı ancak bu turdaki görsel kabul A52 üzerinde yapıldı. Çalışma dalı `feature/notification-highlight`; `src/features/settings/notifications-screen.tsx` içindeki kullanıcının commitlenmemiş bildirim anahtarı/seçim rengi değişikliği korunarak test edildi. Native development/release build üretilmedi.

### Uygulanan ve geçen kontroller

- **Bağlantı ve başlangıç:** Kablosuz ADB cihazı model/seri ile doğrulandı; Expo Go deneyimi LAN Metro'dan açıldı. Home'da Vakit markası, Kâğıthane, 3 Ekim 2026, Yatsı geri sayımı, Türkiye yöntemi ve alt navigasyon göründü.
- **Home/sayaç:** Sayaç yaklaşık 00:58:10'dan 00:51:20'ye ilerledi; Home ve kayıtlı Kâğıthane kaldı. Font ölçeği yeniden yüklemesi sonrasında tekrar açıldığında da kayıtlı durum korundu.
- **Takvim:** Aylık Ekim 2026 görünümü, seçili gün özeti ve gerçek hesaplanan vakitler açıldı. Ramazan görünümü 1448 Hicri / 29 gün / 8 Şubat–8 Mart aralığıyla açıldı. Aylık görünüme dönüldü, Kasım 2026'ya geçildi ve yatay tablo İmsak–Öğle'den Öğle–Yatsı sütunlarına kaydırıldı. Taşma veya boş yüzey görülmedi.
- **Tema:** A52'de Gündüz, Gece ve Gün batımı manuel fazları sırayla seçildi; seçili işaretleri ve paletleri doğru göründü. Başlangıç durumu Gün batımı ve Ramazan'da otomatik olarak geri yüklendi. Görsel karelerde beyaz ara flaş görülmedi. Büyük yazı sırasında Android sistemine ait küçük `Tools` balonu görüldü; uygulama metni olarak sınıflandırılmadı.
- **Kıble:** Kâğıthane için fiziksel sensör aktifti; 152° Güneydoğu, yaklaşık 2.413 km, “gerçek kuzey” ve 3/3 hassasiyet göründü. Arka plan/son uygulamalar dönüşü sonrasında aynı sensör yüzeyi tekrar açıldı.
- **Bildirimler:** İzin açık, 5 vakit etkin (Güneş varsayılan kapalı), Vakit tonu seçili ve 60 gelecek bildirim planlı görüldü. Ana anahtar kapatılıp uzlaştırma tamamlandıktan sonra yeniden açıldı ve 60 plan geri geldi. “3 saniye sonra test et” düğmesi “Test bildirimi planlandı” durumuna geçti; Android bildirim çekmecesinde gerçek “Vakit bildirimi hazır / Bu bir test bildirimidir.” bildirimi görüldü.
- **Yaşam döngüsü:** Home/ayarlar/bildirim ekranı arka plana alındı, launcher ve Son Uygulamalar üzerinden Vakit geri getirildi; Home, konum, sayaç ve 60 bildirim planı korundu.
- **GPS başarı:** Konum seçicide “Konumumu kullan” ile GPS akışı çalıştı ve Kâğıthane Home'a döndü; yeni izin istemeden mevcut izinle yenileme gözlendi.
- **GPS ret/fallback:** Expo Go konum izinleri geçici olarak reddedildi. Vakit'in konum seçicisinde sistem izin diyaloğu açıldı; “İzin verme” sonrasında “Konum izni kapalı. Cihaz ayarlarından açabilir veya şehir seçebilirsin.” mesajı ve 81 il listesi göründü. İzinler ADB ile tekrar verildi; “Konumumu kullan” sonrası Home/Kâğıthane geri geldi.
- **Büyük yazı:** Sistem `font_scale` 1.0 → 1.3 yapıldı. Expo Go yeniden yüklenmesi beklenince Home metinleri büyüdü; sayaç, konum, vakit kartları ve alt navigasyon görünür kaldı. Ölçek 1.0'a geri alındı ve Home yeniden açıldı.
- **Hata izi:** A52 logcat son 5.000 satırda `FATAL EXCEPTION`, `AndroidRuntime FATAL` veya React Native JS hata eşleşmesi bulunmadı. Font ölçeği değişimleri sırasında splash/Expo Go yeniden yüklemesi görüldü; bekleme sonrası deneyim açıldı.
- **Kod regresyonu:** Bu çalışma ağacında `npm run check` (strict TypeScript, ESLint, 61/61 Jest), `npm run test:timezones` (Europe/Istanbul/UTC/America/New_York, 28/28) ve Expo Doctor (21/21) geçti.

### Eksik veya kanıtı sınırlı kalan kontroller

- **Kıble hareket doğrulaması:** Telefonun fiziksel olarak kuzey/doğu/güney/batı yönlerine çevrilmesi ve sekiz çizerek kalibrasyon bu otomasyonda yapılmadı; yalnız sensörün canlı yüzeyi ve 3/3 hassasiyet görüldü.
- **TalkBack:** A52'de TalkBack etkinleştirilmedi. ADB `enabled_accessibility_services=null`, `accessibility_enabled=0` döndürdü; gerçek ekran okuyucu kabulü açık kaldı.
- **Bildirim release davranışı:** Expo Go sınırı nedeniyle özgün ses kanalı, sessiz kanal, uygulamanın kendi paket kimliğindeki özel erişim, reboot, force-stop, Doze/pil tasarrufu ve üretim kanalları kanıtlanmadı. Expo Go paketi üzerinde kesin Android alarm kaydı ayrıca doğrulandı; bu production manifest kanıtı değildir.
- **UI otomasyon ağacı:** Expo Go yoğun/animasyonlu durumdayken `uiautomator dump` “could not get idle state” verdi; sonuçlar ekran görüntüsü, ADB durumları ve sistem bildirim çekmecesiyle doğrulandı.
- **Diyanet matrisi, foreground gece yarısı ve Hermes fallback:** Bu fiziksel turda çalıştırılmadı; release açık işleridir.

Son cihaz durumu: A52 `font_scale=1.0`, konum izinleri foreground açık, Home/Kâğıthane açık, Gün batımı teması ve Ramazan otomatik durumu korunuyor, bildirim anahtarı açık ve 60 olay planlı. Kanıt ekran görüntüleri geçici `C:\Windows\Temp\vakit-a52-check` klasöründe tutuldu; repository'ye eklenmedi.

## Geçen kontroller

- TypeScript strict, ESLint, 76 Jest testi. Gerçek Home/konum componentleriyle GPS reddi → manuel seçim → Home → kayıtlı yeniden açılış; GPS konumunda soğuk açılışta ve arka plandan dönüşte izin istemeden yenileme.
- Onboarding'in konumsuz tamamlanması ve kalıcılığı, v1→v2 state göçü, vakit/Hicri düzeltmelerinin sınırlandırılmış state üzerinden kaydı test edildi.
- Expo Go 57.0.9 / Android 16 Pixel 7 üzerinde sistem izin diyaloğu, ret sonrası Türkçe fallback ve izin sonrası konum isteği denendi. 720×1280 küçük ekran ve 1.3 font ölçeğinde Home kaydırma/alt dock kontrol edildi; erişilebilirlik ağacı için TalkBack servisi emülatörde mevcut değildi, Jest ve native accessibility etiketleri doğrulandı.
- Geç GPS sonucunun yeni manuel seçimi ezmemesi; yenileme hatasında son konumun korunması; storage okuma hatasında okunamamış verinin varsayılanlarla ezilmemesi.
- 28 tarih/hesaplama/tema testi ayrı süreçlerde Europe/Istanbul, UTC, America/New_York altında aynı sonucu verdi.
- Expo Doctor 21/21. Önceki Android/web bundle kontrolleri başarılı. Expo Go 57.0.9 ile Android 16 Pixel 7 emülatörde LAN Metro üzerinden Ankara → Çankaya manuel seçimi, gerçek hesaplanan Home, Yatsı sonrası ertesi gün İmsak hedefi ve Expo Go zorla kapatılıp açıldıktan sonra SQLite kalıcılığı doğrulandı. **Export native build değildir; native build tamamlanmadan durdurulup tüm proje çıktıları temizlendi.**
- Web önizlemede manuel seçim ve Yatsı sonrası yarının İmsak hedefi görüldü. Native GPS/izin ve erişilebilirlik doğrulaması açık.
- Android Expo Go'da genel ayarlar, hesaplama ve Hicri ekranları görsel olarak kontrol edildi. İmsak +1 düzeltmesi Home hesabına anında yansıdı ve genel ayarlarda “1 düzeltme” özeti görüldü. Hicri +1 canlı önizlemeyi 19'dan 20 Rebiülahir'e taşıdı. Deneme değerleri doğrulama sonunda tekrar 0'a getirildi.
- Faz 3 saf planlayıcı için gelecek olay, kronolojik sıra, 15 yerel takvim günü, en yoğun ayarda 180 kayıt güvenlik sınırı, varsayılan kapalı Güneş ve benzersiz kimlikler; scheduler farkı için eşleşeni koruma/eskiyi çıkarma; v2→v3 güvenli migration test edildi.
- Bildirim yenileme kuyruğunun aynı anda yalnız bir uzlaştırma çalıştırdığı, çalışan iş sırasında gelen 1→2→3 tetiklerinin 1→3 olarak en güncel durumda birleştiği ve başarısız bir turdan sonra yeni işi kabul ettiği test edildi.
- Faz 4 takvim domain testleri: aylık gün satırları ve gerçek provider vakitleri, 2026 Ramazan 29 gün sınırı, 2030 Umm al-Qura fallback aralığı ve Hicri gösterim offset'inin namaz saatlerinden bağımsız kalması doğrulandı.
- Faz 5 Kıble domain testleri: İstanbul için büyük çember ilk doğrultusu 151,6° ve yaklaşık 2.405 km, yön normalizasyonu ve en kısa imzalı dönüş doğrulandı. Toplam 60 Jest testi, strict typecheck ve ESLint geçti; zaman dilimi regresyonu Europe/Istanbul, UTC ve America/New_York altında 27 test ile geçti. Expo Doctor 21/21 geçti.
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
- Aynı emülatörde 60 gelecek Vakit olayı gerçek pending/alarm kuyruğunda görüldü; yardım ekranı 60 olay ve son plan tarihini gösterdi. Üç saniyelik test uygulama arka plandayken “Vakit bildirimi hazır” başlığı ve beklenen gövdeyle sistem bildirimine teslim edildi. Expo Go alarmları kesin alarm yetkisi olmadan geniş teslim pencereleriyle kaydetti; bu sonuç tam dakika garantisi değildir. Özgün `vakit_tone.wav`, sessiz kanal ve versioned production kanalları Expo Go'da doğrulanmadı.
- 2 Ekim 2026 uçtan uca Expo Go kontrolünde Home ve alt navigasyon, 81 il/arama sonucu konum akışı, ilk gün seçimi ve başlık ayrımı, Ekim→Kasım geçişi, 1448 Ramazan imsakiyesi, Kıble sensörsüz fallback'i, Görünüm seçenekleri, Ramazan önizlemesi, vakit/Hicri düzeltmeleri, Bildirimler, Bildirim durumu ve Hakkında ekranı tekrar açıldı. Deneme tercihleri sonunda Kâğıthane, sıfır vakit/Hicri düzeltmesi, gün ışığına göre görünüm, Ramazan kapalı ve bildirimler açık durumuna döndürüldü.
- Aynı kontrolde bildirim ana anahtarı 60→0→60 pending olayı doğru yansıttı. Expo Go zorla durdurulup yeniden açıldığında SQLite konum/tercihleri korundu ve 60 olaylık plan yeniden görüldü. Yeniden açılıştan sonraki Android logunda fatal exception veya React Native hata/uyarı kaydı bulunmadı.
- Manuel Gündüz ve Gün batımı geçişlerinden 80/300/700 ms çevresinde alınan karelerde beyaz ara flaş görülmedi. Emülatör Quick Boot durumu ilk açılışta ADB/QEMU'yu kilitledi; veri silmeden `-no-snapshot-load` soğuk başlatma sonrasında uygulama kararlı çalıştı. Bu uygulama çökmesi olarak sınıflandırılmadı.
- Samsung Galaxy A52 fiziksel cihaz / Expo Go gözleminde ilk açılış marka ekranı düzgün göründü, GPS konumu Kâğıthane olarak bulundu ve Kıble pusulası gerçek cihazda doğru yön verdi. Bu kullanıcı gözlemi temel başarı yolunu doğrular; izin reddi/geri alma, farklı yönlerde hassasiyet-kalibrasyon ve abonelik temizliği ayrıca açık kalır.
- Takvim performans düzeltmesi Android 16 Pixel 7 emülatörü / Expo Go'da kontrol edildi. Takvim route'u, Aylık/Ramazan seçimi ve Ekim→Kasım değişimi önce başlık/seçimi çizip hesap sırasında “Vakitler hazırlanıyor…” gösterdi; sonuçlar 1 saniyenin altında geldi. Aynı görünüme dönüş sınırlı tablo önbelleğinden beslenir. Tema perdesi 520 ms'den 240 ms'ye indirildi; Kış seçimi 80 ms ara ve 340 ms tamamlanmış kareyle kontrol edildi, fatal/RN hata kaydı görülmedi. Aynı gün Adhan hesabını yeniden kullanma ve değişen konum/düzeltmeyi ayrı tutma testi eklendi; toplam 61 Jest ve üç host saat diliminde 28/28 test geçti.
- Kullanıcının hızlı fakat ani renk değişimi geri bildirimi üzerine tema geçişi eski gradient/dekoru yeni opak zemin üzerinde 320 ms söndüren gerçek çapraz geçişe çevrildi; içerik renkleri ayrıca 280 ms'lik düşük opaklıklı üst perdeyle yumuşatıldı. Pixel 7 emülatörü / Expo Go'da Kış→İlkbahar ve otomatik mevsime dönüş ara karelerle kontrol edildi; beyaz/gri flaş, fatal veya React Native hata kaydı görülmedi.
- Ek emülatör regresyon turunda Expo Go zorla kapatılıp son LAN projesi yeniden açıldı: Home ve kayıtlı Kâğıthane konumu geri geldi; Takvim ilk yüklemesi, Ramazan sekmesi, Aylık görünüme dönüş ve Ekim→Kasım değişimi tamamlandı. Uygulama logunda fatal exception veya React Native hata/uyarısı bulunmadı. Expo Go'nun genel `gfxinfo` sayacı tüm istemci/önceki çizimleri kapsadığı için uygulama performans metriği olarak kaydedilmedi.
- 2 Ekim 2026 gizlilik/yayın denetiminde uygulama kaynaklarında kullanıcı verisini cihaz dışına gönderen `fetch`, Axios, WebSocket, analiz, reklam veya uzaktan hata raporlama entegrasyonu bulunmadı. Konum ve tercihler SQLite KV alanında yerel; pusula başlığı anlık; bildirim planı cihaz içidir. Expo config introspection, izinlerin yanında `ACCESS_BACKGROUND_LOCATION` için `tools:node="remove"` engelleme kaydını gösterdi. `INTERNET`, geliştirme katmanı ve eski Android depolama bildirimleri production AAB manifestinde ayrıca doğrulanacaktır; izin bulunması tek başına veri aktarımı kanıtı sayılmadı.
- Google Play/KVKK hazırlığı için `docs/PRIVACY-POLICY.md`, Play Console veri güvenliği/izin kontrolü, JavaScript gerektirmeyen `privacy-site/index.html` ve üç sayfalık A4 PDF üretildi. HTML 931 px masaüstü ve gerçek 390×844 Playwright viewport'unda yatay sayfa taşması olmadan açıldı; sayfa dili/başlık hiyerarşisi, bağlantılar, sıfır script ve sıfır tarayıcı hata/uyarısı doğrulandı. PDF'nin üç sayfası PNG'ye render edilip Türkçe karakter, taşma, üstbilgi/altbilgi ve sayfa numaraları görsel olarak kontrol edildi.
- Android 16 Pixel 7 / Expo Go'da güncel Hakkında ekranındaki yerel veri, pusula, silme ve gizlilik iletişimi metinleri okunabilir göründü. Bildirim durumundaki belirsiz `Son plan` etiketi `Şu tarihe kadar planlandı` olarak değiştirildi; 60 olaylık kuyruk için `14 Ekim Çarşamba · 12:55` değeriyle cihaz ekranında doğrulandı. `npm run check` 61/61, üç host saat diliminde 28/28 ve Expo Doctor 21/21 geçti.

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

## 4 Ekim 2026 — geniş Diyanet vakit matrisi ve gelecek yıl kontrolü

- Tek İstanbul örneği, canlı resmî sayfalardan tekrarlanabilen `npm run verify:prayer-times` kontrolüne genişletildi. İstanbul, Ankara, İzmir, Antalya, Sinop, Erzurum ve Iğdır; 22 Ekim 2026, 21 Ocak 2027, 8 Şubat 2027 Ramazan başlangıcı, 21 Mart 2027 ve 21 Haziran 2027 tarihlerinde karşılaştırıldı.
- Toplam 35 şehir-tarih satırı ve 210 vakitte ortalama mutlak fark **0,41 dakika**, en büyük mutlak fark **2 dakika** bulundu. İki dakikalık mühendislik inceleme eşiğini aşan satır yoktu. Bu, resmî Diyanet verisi kullanıldığı veya dinî doğruluk sertifikası anlamına gelmez; hesap yaklaşımının seçili örneklerde yakınlığını gösterir.
- Kalıcı regresyon testine yedi şehirden kayıtlı resmî örnekler eklendi. 2030-01-01 için altı vaktin yıllık tablo indirmeden üretildiği doğrulandı. `npm run check`: 9 suite, 71/71 test geçti. Üç host saat diliminde mevcut 28/28 zaman testi tekrar geçti.
- Hicrî ay başlangıçlarının resmî paket kapsamı 2028 sonuna uzatıldı. Diyanet 2028 listesine göre Ramazan 28 Ocak–26 Şubat 2028 aralığıdır ve yeni test bu aralığı `diyanet-months` kaynağıyla doğrular. 2029-01-16 yalnız sonraki ay sınırı sentinel'idir; sonrasında cihazın açıkça etiketlenen Umm al-Qura fallback'i devam eder.
- Vakitler uygulama kullanımında Diyanet'ten sürekli indirilmez. Adhan 4.4.6 ve Turkey yöntemi uygulama sürümünde sabittir; canlı karşılaştırma komutu release öncesinde ve hesaplama/konum değişikliklerinde yeniden çalıştırılmalıdır.

## Paket güvenliği

npm audit: 0 critical/high, 14 moderate rapor; çoğu aynı iki advisory'nin üst paketlere yayılımı. [decode-uri-component](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr) Router → query-string üzerinden runtime URI ayrıştırmayı etkiler. [uuid](https://github.com/advisories/GHSA-w5hq-g745-h8pq) Expo xcode build araç zincirindedir. Otomatik öneri Expo 46/Router 5'e uyumsuz düşürme; uygulanmadı. decode-uri-component 0.5 API/modül uyumu doğrulanmadan override yapılmadı. **Release öncesi upstream uyumlu düzeltme veya doğrulanmış adaptör gerekir.**

## Açık cihaz/release kontrolleri

### 4 Ekim 2026 — A52 seçili bildirim akışı simülasyonu

- Yeni fiziksel kabul denetimi, Bildirimler ekranındaki seçili ayarı gerçek saat beklemeden tetikler: etkin ön-hatırlatma 3 sn, etkin vakit-anı bildirimi 6 sn sonra ayrı yerel test kaydı olarak planlanır. Bu kayıtlar gerçek `vakit` kuyruğundan ayrıdır; cihaz saatini ve 60 olaylık gerçek planı değiştirmez.
- Galaxy A52 / Expo Go üzerinde **15 dk** seçiliyken sistem çekmecesinde “İmsak vaktine 15 dakika / Adana · simülasyon” ve “İmsak vakti girdi / Adana” teslim edildi (geçti). **30 dk** ile aynı tur tekrarlandı; “İmsak vaktine 30 dakika / Adana · simülasyon” ile vakit-anı bildirimi aynı çekmecede görüldü (geçti). Geçici ekran görüntüleri repository dışındadır.
- Ana bildirim anahtarı kapatıldığında cihazdaki Vakit planı kaldırıldı; tekrar açıldığında UI “60 gelecek bildirim cihazda planlandı.” durumuna döndü (geçti). Test bitiminde tercihler geri alındı: ana anahtar açık, vakit anı açık, ön-hatırlatma kapalı, Vakit tonu seçili.
- A52'nin sistem sessiz anahtarı test boyunca açıktı; sesi fiziksel olarak işitildi diye bir sonuç çıkarılmadı. Sistem dökümü Expo Go teslimlerinin `expo_notifications_fallback_notification_channel` üzerinden Android sistem bildirim sesine ve titreşime yönlendiğini gösterdi. Bu nedenle Expo Go'da seçili **Vakit tonu** özgün `vakit_tone.wav` için kanıt değildir; **Sistem sesi** cihazın varsayılan bildirim sesidir. **Sessiz** seçeneğinin gerçekten sessiz kanal davranışı da yalnız native development/production build'de doğrulanabilir.

### 4 Ekim 2026 — GPS soğuk açılış ve 15 günlük bildirim uzlaştırması

- Kayıtlı kaynak GPS ise uygulama soğuk açılışta, sistem izin penceresini yeniden göstermeden (`requestPermission: false`) tek foreground ölçümü başlatır. Başarılı ölçüm kayıtlı konumu günceller; timeout/izin/servis hatasında son geçerli konum korunur. Geç sonuç yeni manuel seçimi revision koruması nedeniyle ezemez.
- Bildirim ufku sabit olay sayısından bugün dahil 15 yerel takvim gününe çevrildi. Varsayılan beş vakit ve vakit-anı seçimi 75; 15/30/45 dakika ön-hatırlatma da açıksa 150; Güneş dahil en yoğun seçim 180 kayıttır.
- Öğle kapatıldığında yeni saf planda Öğle için ne ön-hatırlatma ne vakit-anı kaydı üretildiği ve uzlaştırma farkının mevcut iki Öğle kaydını stale/silinecek olarak işaretlediği test edildi. Değişiklik native uzlaştırmada yalnız `owner=vakit` kayıtlarını iptal eder.
- Uzlaştırma hatası Bildirimler ekranında canlı hata metni ve **Planı yeniden dene** düğmesi sunar; mevcut tek-işlem kuyruğunun başarısız turdan sonra yeni işi kabul etmesi regresyon testiyle korunur.
- `npm run check`: 9 suite, 76/76 test; strict TypeScript ve ESLint geçti. `npm run test:timezones`: Europe/Istanbul, UTC ve America/New_York süreçlerinin her birinde 28/28 geçti. Bu turda fiziksel cihaz pending listesi yeniden okunmadı; cihaz kanıtı değil kod/regresyon doğrulamasıdır.

### 4 Ekim 2026 — A52 gerçek vakit teslim kabulü

- Kullanıcı Galaxy A52 / Expo Go üzerinde uygulama ekranda açık değilken İmsak, Öğle ve İkindi vakit-anı bildirimlerinin birbirinden ayrı ve doğru saatlerde geldiğini doğruladı.
- İkindi bildirimi saat **16:18**'de **“İkindi vakti girdi”** başlığı ve **“Kâğıthane”** konum içeriğiyle teslim edildi; aynı anda çevrede ezan okunması vakit eşleşmesine kullanıcı gözlemi sağladı. Bu dış ezan, uygulamanın özgün bildirim sesinin çalıştığına kanıt sayılmaz.
- Kullanıcı, konumu **İzmir** olarak değiştirdikten ve **15 dakika önce** ön-hatırlatmasını etkinleştirdikten sonra, Expo Go arka plandayken saat **18:42**'de **“Akşam vaktine 15 dakika”** başlığı ile **“18:57 · İzmir”** içeriğini aldı. Böylece gerçek, konuma bağlı 15 dakikalık ön-hatırlatma teslimi de A52 üzerinde geçti.
- İkinci şehir tekrarı olarak kullanıcı Ordu konumunda, Expo Go arka plandayken saat **19:18**'de **“Yatsı vaktine 15 dakika”** ve **“19:32 · Ordu”** içeriğini aldı (geçti). Yatsı vakit-anı teslimi aynı turda 19:32 için izleniyor.
- Kâğıthane tekrarında A52 AlarmManager kaydı ön-hatırlatmayı **19:52** için oluşturdu ancak normal/inexact alarm penceresi bunu **19:58:54**'te çalıştırdı. Kullanıcı bildirimi 19:58'de **“Yatsı vaktine 15 dakika / 20:07 · Kâğıthane”** olarak aldı; fiilen yaklaşık 9 dakika kalmıştı. Plan hesabı doğru, teslim yaklaşık 6 dakika 54 saniye gecikti. Bu, kesin zamanlama izni kaldırıldığında “15 dakika önce” ifadesinin cihaz teslim saatini garanti etmediğini fiziksel cihazda gösterir.
- Aynı Kâğıthane turunda vakit-anı kaydı cihazda **20:07** için ve Kâğıthane içeriğiyle mevcuttu; Android kaydı **20:24:38**'de çalıştırdı ve kullanıcı **“Yatsı vakti girdi / Kâğıthane”** bildirimini aldı. Konum değişikliği doğru biçimde uzlaştırılmıştı; yaklaşık 17 dakika 38 saniyelik gecikmenin nedeni eski İzmir planı değil, AlarmManager'ın kesin olmayan yaklaşık 17 dakika 22 saniyelik teslim penceresidir.
- Aynı akışta beklenen **18:57 Akşam vakit-anı bildirimi** kullanıcı tarafından alınmadı. Ön-hatırlatma, vakit-anı anahtarından bağımsız planlanır; bu nedenle Bildirimler ekranında **Vakit girince bildir** ve **Akşam bildirimi** anahtarlarının açık olduğu ile güncel planın cihazda bulunduğu yeniden kontrol edilmelidir. İkisi de açıksa bu, normal Android zamanlamasında tekil teslim gecikmesi/atlaması olarak açık cihaz bulgusudur; Expo Go ile kesin alarm garantisi yoktur.
- Bu sonuç gelecekteki yerel kayıtların Android tarafından uygulama foreground'da değilken teslim edildiğini ve Kâğıthane için vakit-anı başlık/konum içeriğini doğrular. Cihazın gerçekten Android `force-stop` durumunda olduğu kanıtlanmadığından force-stop/reboot/Doze ve özgün Vakit tonu kabulü hâlâ native build kapısındadır.

### 4 Ekim 2026 — Kesin zamanlama yeniden etkinleştirildi

- A52'de izinsiz tarih tetikleyicilerinin ön-hatırlatmayı yaklaşık 7, vakit-anı kaydını yaklaşık 18 dakika geciktirmesi üzerine kullanıcı `SCHEDULE_EXACT_ALARM` özel erişimini yeniden onayladı. `USE_EXACT_ALARM` eklenmedi.
- Bildirimler ekranındaki **Sistem ayarını aç** eylemi Samsung'un **Alarmlar ve hatırlatıcılar** sayfasını doğrudan Expo Go paketi için açtı. Anahtar açıldıktan ve uygulamaya dönüldükten sonra eski yaklaşık kayıtlar silinip güncel Kâğıthane/15 dakika tercihleriyle yeniden kuruldu.
- ADB `appops` çıktısı Expo Go için `SCHEDULE_EXACT_ALARM: allow` verdi. AlarmManager'da uygulamaya ait **140/140** gelecek kayıt `window=0 exactAllowReason=permission`, **0** kayıt geniş zaman penceresi olarak görüldü. Örnek kayıtlar 5 Ekim İmsak ön-hatırlatma 05:18 ve vakit-anı 05:33'tür. Bu, Expo Go hostu üzerinde planlama türünü kanıtlar; gerçek teslim dakikası uzun süreli gözlemle, Vakit paket kimliği/manifesti ise ileride native build ile ayrıca kabul edilecektir.
- Android'in bu özel erişimi normal runtime izin kontrolüyle güvenilir okunamadı: erişim açıkken `PermissionsAndroid.check` false kalırken AlarmManager kesin planlama yaptı. Bu nedenle UI “Açık/Kapalı” iddiası yerine **Sistem ayarı** gösterir; ayardan her dönüşte kayıtları zorunlu yeniden planlar.

### 5 Ekim 2026 — A52 kesin zamanlı gerçek teslim kabulü

- Kullanıcının Galaxy A52 bildirim çekmecesi ekran görüntüsü ve gözlemiyle, Expo Go ekranı açık değilken dört ayrı yerel bildirim hedef dakikalarında teslim edildi: **İmsak 15 dakika önce 05:18**, **İmsak vakti 05:33**, **Öğle 15 dakika önce 12:42** ve **Öğle vakti 12:57**.
- Başlıklar sırasıyla **“İmsak/Öğle vaktine 15 dakika”** ve **“İmsak/Öğle vakti girdi”** biçimindeydi; hedef saat ve **Kâğıthane** içeriği doğruydu. Böylece `SCHEDULE_EXACT_ALARM` özel erişimi açık Expo Go hostunda hem ön-hatırlatma hem vakit-anı için gerçek teslim dakikası fiziksel cihazda geçti; önceki normal/inexact zamanlamada görülen 7–18 dakikalık gecikme bu akışta oluşmadı.
- Bu kanıt “Expo Go arayüzü kapalı/foreground dışında” durumunu doğrular; Android ayarlarından **Zorla durdur** uygulanmış bir süreci kanıtlamaz. Bildirimler Expo Go altında gruplanmıştır. Vakit'in production paket kimliği ve manifesti, özgün `vakit_tone.wav`, sessiz kanal, reboot, force-stop ve Doze/pil tasarrufu kabulü native build kapısında açık kalır.

### 4 Ekim 2026 — TalkBack kapsam kararı

- Vakit herhangi bir Android AccessibilityService kullanmaz; TalkBack yalnız sistem ekran okuyucusudur. Bu nedenle özel erişilebilirlik izni veya Play Console Accessibility API beyanı gerekmez.
- Etkileşimli native kontrollerde erişilebilir ad/rol/durumlar zaten kullanılıyor. Gerçek TalkBack sesli gezinme kabulü, kullanıcı deneyimi kalite kontrolü olarak açık kaldı; uygulamanın çalışması ya da mağaza için ek bir erişilebilirlik servisi geliştirme gerekmiyor.
- Kullanıcı A52'de Kıble'nin doğru çalıştığını ve JavaScript splash yüzeyini kabul etti. Native işletim sistemi splash'i Expo Go'da değerlendirme kapsamı dışındadır.
- `npm run check`: strict TypeScript, ESLint ve 62/62 Jest testi geçti.

- Android 16 Pixel 7 / Expo Go'da manuel Gün batımı temasında Takvim yeniden kontrol edildi. Aylık görünüm ve Ramazan seçili durumları ile vakit/imsakiye çizelgeleri, opak koyu `surfaceStrong` yerine Home “Bugün” kartıyla aynı yarı saydam `surface` ve seçili `highlight` yüzeylerini kullanıyor; iki görünümde de okunabilirlik ve yatay tablo korunuyor. Fiziksel A52 kabulü hâlâ açıktır.
- iOS ve App Store kapsam dışıdır. Android Expo Go yeniden açılışında SQLite verisi doğrulandı. `adb emu geo fix` ile İstanbul koordinatı verilmesine rağmen Expo Location dengeli doğruluk isteği 2 Ekim kontrolünde yine timeout oldu; hata mesajı ve manuel seçim fallback'i doğru gösterildi, fakat Android GPS başarı yolu emülatörde kanıtlanamadı.
- Foreground saat sıçraması/gece yarısı; Hermes Intl takvim fallback'i.
- VoiceOver/TalkBack gerçek cihaz testi; azaltılmış hareket ve kontrast.
- GeoNames resmî ilçe listesi kapsamı ve 29 yaklaşık koordinatın iyileştirilmesi; sınır noktaları.
- Android Expo Go izin, pending kuyruk, varsayılan kanalda arka plan teslimi ve özel erişim açıkken `window=0` kesin alarm kaydı geçti. Android development build üzerinde Vakit paket kimliğindeki özel erişim, özgün ses, sessiz kanal, reboot, force-stop ve Doze/pil tasarrufu davranışı gerçek cihaz kabulü için açık release kapısıdır.
- Faz 4 için gerçek cihaz erişilebilirlik ve iyileştirilen ay/sekme performansının A52'de yeniden kabulü henüz release kanıtı değildir; emülatör gözlemi Android Expo Go ile sınırlıdır.
- Faz 5 temel fiziksel cihaz başarı yolu Galaxy A52'de doğru pusula yönüyle gözlendi. Konum izni ret/verme, trueHeading yokken manyetik veri, yüksek/düşük hassasiyet, hareket/kalibrasyon ve ekran kapanınca başlık aboneliğinin durması yine doğrulanmalıdır. Emülatördeki sensörsüz durum bu kontrollerin yerine geçmez.
- Faz 6 için native release build, launcher maskesi, Play Console önizlemesi ve bildirim/ikon kaynaklarının gerçek Android cihazda doğrulanması gerekir. Hakkında/Gizlilik/Kaynak/Lisans ekranı, splash config çıktısı, erişilebilir başlık/etiketler ve Android ikon asset entegrasyonu Expo config ile doğrulandı; kullanıcı ikonu `assets/icon/` altında işlendi. Expo Go, native launcher ikonunu güncellemez.
- Android 16 Pixel 7 / Expo Go 57.0.9'da güncel Metro bundle yeniden açıldı; Settings akışı ve yeni raster asset importu hata vermeden çalıştı. Bu, adaptive launcher maskesinin veya native splash görselinin kanıtı değildir.
- Android 16 Pixel 7 / Expo Go 57.0.9'da Ayarlar → Hakkında ve gizlilik ekranı açıldı; marka başlığı, veri saklama özeti, kaynak kartı ve lisans içeriği küçük ekran kaydırma düzeninde okunabilir göründü. Native OS splash görüntüsü Expo Go'da ayrı doğrulanmadı; Expo config yalnız arka plan renkleriyle doğrulandı.
- Uygulama kimliği, imzalama ve Android native release build henüz yok. Android ikon ve splash config'i repository'de mevcut; native launcher/Play Store önizlemesi ayrıca doğrulanacak. Gizlilik HTML'i `https://vakit-privacy.netlify.app/` adresinde HTTP 200, HTTPS/HSTS, doğru destek adresi ve kesin alarm açıklamasıyla doğrulandı; canlı içerik yerel `privacy-site/index.html` ile birebir eşleşti. Hakkında ekranına aynı URL için erişilebilir bağlantı eklendi; strict typecheck, ESLint ve 76/76 Jest testi geçti. Android 16 Pixel 7 emülatörü / Expo Go üzerinde Ayarlar → Hakkında ve gizlilik → Gizlilik politikasını aç akışı uygulandı: bağlantı görünür ve erişilebilir buton rolündeydi, Chrome doğru HTTPS domainini güvenli bağlantı göstergesiyle açtı, “Vakit - Gizlilik Politikası” başlığı ve sayfa içeriği yüklendi; fatal/React Native/URL açma hatası bulunmadı. Play Console alanına URL'nin girilmesi kullanıcı hesabındaki yayın adımı olarak açıktır.
- Herkese açık geliştirici destek adresi kullanıcı tarafından `support.alemdem@gmail.com` olarak doğrulandı ve uygulama, HTML, Markdown ve PDF kaynaklarına işlendi. Uygulama hesap oluşturmadığı ve geliştirici sunucusunda hesaba bağlı veri tutmadığı için hesap silme URL'si/akışı eklenmedi; yerel verilerin Android ayarlarından temizlenmesi açıklaması korundu. Eski iletişim adresi kaynaklarda ve yeniden üretilen PDF'de bulunmuyor; PDF üç sayfa yeniden render edilerek görsel kontrol edildi. Geliştirici görünen adı Play profiliyle yayımdan önce ayrıca doğrulanmalıdır. Hedef kitle/Families seçimi ve KVKK hukuki değerlendirmesi release kapısıdır.

### 3 Ekim 2026 — A52 bildirim ayrıntısı ve Kıble metni devam kontrolü

- Kıble hizalama metni kullanıcı diline çekildi: teknik “Pusula gerçek kuzey verisiyle hizalandı.” yerine “Kıble ile hizalandın.” gösteriliyor. A52 canlı ekranda Kıble doğrultusu ve bu yeni açıklama görüldü.
- Kıble yardım metni, sekiz çizerek kalibrasyonu açıklar hale getirildi: telefon havada yavaşça sekiz çizilerek hareket ettirilir; amaç yön sensörünün kalibrasyonuna yardımcı olmaktır. Bu işlem uygulamanın özel bir namaz ayarı değil, Android cihaz sensörü kalibrasyon davranışıdır.
- Bildirimler ekranında ön hatırlatma seçenekleri A52 üzerinde ayrı ayrı seçildi: 15 dk ve 30 dk. Her iki seçimde özet metni sırasıyla “15 dakika önce” ve “30 dakika önce” oldu; 30 dk seçiminde plan durumu 60 gelecek bildirim gösterdi. Kontrol sonunda tercih “Kapalı”ya geri alındı.
- Uygulama arka plandayken 3 saniyelik test bildirimi sistem çekmecesinde “Vakit bildirimi hazır / Bu bir test bildirimidir.” içeriğiyle teslim edildi (geçti).
- Expo Go hostu `am force-stop host.exp.exponent` ile zorla durdurulduktan sonra önceden tetiklenen 3 saniyelik test bildirimi görünmedi (başarısız/sınırlı). Bu sonuç Expo Go geliştirme hostunun force-stop sonrası yerel bildirim sınırını gösterir; production/development build davranışını kanıtlamaz. Uygulama Expo Go’dan yeniden açıldı ve ayarlar geri yüklendi.
- Bu turda 15/30 dakikalık gerçek vakit bildiriminin saatini bekleyerek uçtan uca teslim yapılmadı; planlama UI’si, kuyruk sayısı ve domain testleri doğrulandı. Gerçek dakika teslimi, ekran kilidi/Doze/reboot ve Expo Go dışı build kapısında tekrar edilmelidir.
- `npm run check`: strict TypeScript, ESLint ve 61/61 Jest testi geçti.

### 3 Ekim 2026 — Expo Go devam kontrolü, A52 bağlantı durumu

- Fiziksel cihazda ek kontrol için önceki kablosuz ADB hedefi `192.168.1.109:39759` yeniden denenmiştir. Hedef zaman aşımına uğradı; `adb mdns services` A52 için bir kablosuz hata ayıklama servisi döndürmedi ve yerel ARP tablosunda önceki IP görünmedi. Bu nedenle bu turda A52 arayüzüne otomatik erişim sağlanamadı; telefona yeni test ayarı uygulanmadı.
- Kod seviyesinde üç saat dilimi regresyonu tekrar geçti: Europe/Istanbul, UTC ve America/New_York altında 28/28 test. Expo Doctor 21/21 geçti.
- Yerel 8081 dinleyicisi bu kontrol anında görünmedi; Metro geçici süreç olduğu için çalışıyor varsayılmadı. Expo Go'da önceden açık deneyim, bilgisayardan yeni bundle/cihaz kontrolü için yeterli kanıt değildir.
- Expo Go ile tamamlanabilecek fakat bu bağlantı kesintisi nedeniyle bu turda uygulanamayan fiziksel kontroller: Kıble başlığının yön değişimindeki canlı tepkisi, düşük hassasiyet/kalibrasyon yüzeyi, gerçek TalkBack sesli gezinmesi ve ek bildirim teslim gözlemi. Bunlar kablosuz hata ayıklama yeniden bağlandığında sürdürülmelidir.

### 3 Ekim 2026 — A52 yeniden bağlantı ve Expo Go açılışı

- Kullanıcı A52'de Kablosuz hata ayıklamayı yeniden açtıktan sonra mDNS keşfi `SM-A525F` için güncel adresi `192.168.1.102:39649` olarak döndürdü. Güvenli ADB bağlantısı kuruldu ve cihaz `a52q` olarak doğrulandı.
- Metro yeniden başlatıldı; bilgisayarın `192.168.1.118:8081` dinleyicisinde A52'den etkin bağlantılar görüldü. Expo Go deneyimi yeniden açıldı ve A52 ekranında Home/Kâğıthane ile yarının İmsak sayacı görüntülendi.

### 3 Ekim 2026 — A52 Expo Go ek fiziksel kontrolleri

- **Kıble sensör yaşam döngüsü geçti:** Kıble ekranı açıkken A52 `ak0991x Magnetometer` ve ivmeölçerini Expo Location üzerinden 200 ms örneklemeyle etkinleştirdi. Home'a dönüldüğünde her iki abonelik için kapatma kaydı görüldü. Bu, ekran değişince pusula sensörü aboneliğinin temizlendiğini doğrular.
- **Kıble canlı durum ve erişilebilirlik geçti:** Fiziksel ekranda 152° Güneydoğu, gerçek kuzey, 3/3 hassasiyet ve 24° yön farkı görüldü. Başlık, yön farkı değiştiğinde canlı değer gösteriyor. UI ağacı bu sefer başarıyla alındı: “Kıble oku, 23 derece yön farkı”, Geri, Konumu değiştir ve alt navigasyon erişilebilir adları mevcut; güncel sekiz çizerek kalibrasyon açıklaması da erişilebilir metin olarak görünüyor.
- **Bildirim kilit ekranı teslimi geçti:** Vakit tonu seçili, beş vakit etkin ve 60 olay planlı durumdayken 3 saniyelik test planlandı. Ekran kapatılıp tekrar uyandırıldığında A52 kilit ekranında “Vakit bildirimi hazır / Bu bir test bildirimidir.” bildirimi göründü; bildirim çekmecesinde de aynı başlık/gövde vardı.
- **Bildirim erişilebilirliği geçti:** `uiautomator` ağacı Bildirimler ekranında Vakit tonu/Sistem sesi/Sessiz için radyo rolleri ve seçili durumunu; İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı için adlandırılmış anahtarları; planlama metnini ve test düğmesini gösterdi.
- **Metro/Expo Go bağlantısı onarıldı:** Metro ilk açılışta development build modunda geldi; Expo Go moduna geçirildi. Kablosuz ADB üzerinden `tcp:8081` reverse yönlendirmesi kuruldu, bundle yeniden yüklendi ve Expo CLI bağlantı uyarısı UI ağacından kayboldu. Home/Kâğıthane tekrar açıldı.
- **Hata izi:** Bu turdaki 2.500 satırlık logcat taramasında Vakit/Expo React Native için fatal exception veya JavaScript hata eşleşmesi yoktu. Görülen AndroidRuntime kayıtları çalıştırılan `uiautomator` komutunun kendi sürecine aitti.
- **Açık kalanlar:** Telefonu elle farklı yönlere döndürerek yön değerinin birden çok fiziksel konumda değiştiğinin kullanıcı gözlemi, düşük hassasiyet/sekiz kalibrasyonu sonrası ölçüm ve gerçek TalkBack sesli gezinmesi otomasyonla tamamlanmadı. 15/30 dakika ön hatırlatmanın gerçek vakit saatindeki teslimi ve force-stop/Doze/reboot ise Expo Go sınırını aşar.

Tasarım koruması: 76 referans dosyasının sıralı yol+SHA256 birleşik hash'i başlangıçla aynı: 72526F33396A5AD829A975E55BE0573E60892FF7B38657842F83D9BA970ECB79. Kaynak/konfigürasyon dosyalarında anahtar kalıbı taraması temiz. 390×844 web görünümünde sayaç/konum/ertesi gün kartı ve kaydırılabilir vakitler kontrol edildi; screenshot artifacts/home-mobile.png (Git dışında).
# 13 Ekim 2026 — Play Store telefon görselleri

- Android 16 Pixel 7 emülatörü (`1080×2400`) Expo Go + LAN Metro ile bağlandı; `exp://192.168.1.118:8081` üzerinden güncel Vakitname bundle'ı açıldı.
- Gerçek uygulama ekranları yakalanıp sistem çubuğu alanı kırpılarak Play Store'un 9:16 gereksinimine uygun `1080×1920` PNG olarak dışa aktarıldı: Home (`01-home.png`), Kıble (`02-qibla.png`), Ramazan imsakiyesi (`03-ramadan-calendar.png`), bildirim ayarları (`04-notifications.png`), gün batımı temalı Home (`05-home-sunset.png`), gün batımı temalı Ayarlar (`06-settings-sunset.png`) ve üst bölüm/sayaç/konum odaklı gün batımı Home (`07-home-sunset-overview.png`).
- Görseller repository içinde `output/play-store/screenshots/` altında tutuluyor; tasarım referansı veya WebView çıktısı kullanılmadı. Kıble ekranı emülatör sensörü/konum izni sınırlaması nedeniyle manuel açı durumunu gösteriyor; bu durum görselin gerçek uygulama yüzeyi olduğunu değiştirmiyor.
- Hicri tarih ekranı gün batımı paletinde ayrıca `08-hijri-sunset.png` olarak yakalandı; mağaza setindeki görsellerin her biri farklı bir uygulama işlevini göstermesi hedefleniyor.
- Gece görünümü manuel seçilerek Kıble ekranı `09-qibla-night.png` olarak 1080×1920 yakalandı; işlem sonunda görünüm otomatik ayara geri alındı.
- `08-hijri-sunset.png` yeniden yakalandı ve içerik doğrulandı: “Hicri tarih”, Miladi/Hicri karşılık ve ±2 günlük düzeltme kontrolleri görünür; PNG boyutu 1080×1920.
- Kullanıcı 13 Ekim 2026'da Play Console'a yedi telefon görselini şu sırayla yükledi: `07-home-sunset-overview.png`, `09-qibla-night.png`, `03-calendar.png`, `03-ramadan-calendar.png`, `04-notifications.png`, `06-settings-sunset.png`, `08-hijri-sunset.png`. Bu yükleme durumu kullanıcı beyanına dayanır; Play Console iç ekranı ayrıca bu oturumda açılmadı.

# 14 Ekim 2026 — AAB öncesi doğrulama

- `npm run check`: geçti — 10 test paketi, 88 test; strict TypeScript ve ESLint dahil.
- `npm run test:timezones`: geçti — üç host saat diliminde toplam 28/28 test.
- `npm ci --dry-run --ignore-scripts`: lockfile kurulumu başarılı. Yalnız Node engine uyarısı (proje `>=24 <25`, mevcut Node `25.2.1`) ve test-renderer'ın React peer uyarısı görüldü; dosya değişmedi.
- `npx eas-cli@latest config --platform android --profile production`: geçti; `com.alemdem.vakitname`, `versionCode: 1`, `channel: production`, `buildType: app-bundle`, remote credentials doğrulandı. Build başlatılmadı.
- İlk `npx expo-doctor` taraması 20/21 geçti; tek başarısız kontrol SDK 57 patch beklentileriyle yedi paketin geride olmasıydı. Bu başlangıç bulgusu aşağıdaki hizalama takibinde giderildi.

## 14 Ekim 2026 — Expo patch hizalaması ve Node 24 tekrar kontrolü

- İlk kontrolde görülen yedi SDK 57 patch farkı `npx expo install` ile giderildi. `package.json` ve `package-lock.json` artık Expo Doctor'ın beklediği aralıklara hizalıdır: `expo` 57.0.28, `expo-dev-client` 57.0.20, `expo-location` 57.0.21, `expo-router` 57.0.26, `expo-splash-screen` 57.0.10, `expo-updates` 57.0.26 ve `jest-expo` 57.0.6.
- Node 24.21.0 geçici doğrulama ortamında `npm run check` geçti (10 test paketi, 88 test) ve `npx expo-doctor` 21/21 kontrolü geçti. `npm run test:timezones` daha önce üç host saat diliminde 28/28 olarak geçti.
- `npm ls --depth=0` ile hizalanan doğrudan bağımlılıklar doğrulandı; `git diff --check` temizdir. React 19.2.3 için test-renderer peer uyarısı yalnızca geliştirme/test ağacındadır; `audit fix --force` veya uyumsuz downgrade uygulanmadı.
- Proje motor aralığı `>=24 <25` olduğundan release komutları Node 24.x ile çalıştırılmalıdır. EAS production yapılandırması doğrulanmış olsa da AAB build bu kontrolde başlatılmadı; kullanıcı onayı sonrası ayrı release adımıdır.

## 14 Ekim 2026 — Production AAB build kuyruğu

- Kullanıcının açık onayıyla Node 24 ortamından `eas build --platform android --profile production --non-interactive` başlatıldı.
- EAS build kimliği `75b25247-e3d3-4218-870a-df72ba837791`; mevcut durum `IN_PROGRESS`. Profil `production`, dağıtım `STORE`, package `com.alemdem.vakitname`, `appVersion` `0.3.0-rc.1`, `versionCode` `1`, channel `production` ve commit `51c41e5` olarak doğrulandı.
- Build süreci kuyruğa alındı ve EAS fingerprint hesaplandı. Artifact henüz hazır değil; AAB tamamlandıktan sonra indirme, imza/manifest kontrolü ve Play Console yüklemesi ayrı adımlardır.

## 14 Ekim 2026 — İlk production build hatası

- İlk production build `75b25247-e3d3-4218-870a-df72ba837791` prebuild aşamasında durdu. Expo Notifications config plugin, `vakit-tone` Android kaynak adını geçersiz buldu; Android kaynak adları tire içeremez.
- Kaynak dosyası `assets/sounds/vakit_tone.wav` olarak yeniden adlandırıldı; `app.json`, bildirim scheduler'ı ve teknik belgelerdeki referanslar güncellendi. Yeni build, bu düzeltmenin commit edilip kontrolleri geçmesinden sonra tekrar kuyruğa alınacaktır.

## 14 Ekim 2026 — Düzeltilmiş production AAB build kuyruğu

- `npm run check` (88/88), Expo Doctor (21/21) ve Expo config kontrolleri düzeltmeden sonra geçti; commit `e0fd887`.
- Yeni EAS production build `33c3b456-2d44-44ca-872d-6ba0a597bfe0` olarak kuyruğa alındı ve `IN_PROGRESS`. Package `com.alemdem.vakitname`, `appVersion` `0.3.0-rc.1`, `versionCode` `1`, dağıtım `STORE` ve production channel doğrulandı.
- İlk hatalı build `75b25247-e3d3-4218-870a-df72ba837791` olarak başarısız kaldı; Play Console'a hiçbir artifact yüklenmedi. Yeni build tamamlanınca AAB indirme, imza/manifest ve gerçek cihaz kontrolleri yapılacak.

## 14 Ekim 2026 — Dahili test sürümü yayımlandı

- Kullanıcı EAS build `33c3b456-2d44-44ca-872d-6ba0a597bfe0` artifact'ini indirdi ve Play Console dahili test sürümüne sürükle-bırak ile yükledi.
- Play Console sürüm özeti `1 (0.3.0-rc.1)`, target SDK 36, API 24+, 16 KB bellek sayfası desteği ve 31,5 MB yeni indirme boyutu gösterdi. AAB'nin 79 MB dosya boyutu ile mağazadaki cihaz-özel indirme boyutu birbirinden farklıdır.
- R8/proguard mapping dosyası bulunamadı uyarısı gösterildi; R8 etkin olmadığı için bu bir yayın engeli değildir. İlk dahili testte yeni build almadan devam edildi.
- Kullanıcı **Kaydet ve yayınla** ile dahili test sürümünü yayımladı. Bu, production yayını değildir. Opt-in bağlantısı/test kullanıcısı kurulumu ve A52 smoke testi açık; kapalı testin 12+ katılımcı/14 gün koşulu henüz başlamadı.

# 13 Ekim 2026 — Gün batımı ayar ekranı renk uyumu

- Gün batımı temasında `Vakit hesabı`, `Hicri tarih` ve Kıble pusula merkezindeki koyu lacivert `surfaceStrong` yüzeyleri sıcak, yarı saydam gün batımı yüzeylerine bağlandı. Emülatörde vakit düzeltme satırları, Hicri ± düğmeleri/çipleri ve canlı Hicri önizleme diğer ekranlarla tutarlı göründü.
- `npm run check`: 88/88 test, strict TypeScript ve ESLint geçti.

