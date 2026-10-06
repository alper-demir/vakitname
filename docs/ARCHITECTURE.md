# Teknik kararlar

Durum: ilk dikey dilim, Faz 2–5 uygulandı; Faz 6 yayın hazırlığı sürüyor. Android Expo Go teslimi geçti, production native bildirim doğrulaması açık. Güncel kanıtlar VALIDATION.md, kaynaklar DATA-SOURCES.md içinde. Kaynak incelemesi: 1 Ekim 2026.

## Kapsam ve yapı

Türkiye; Türkçe öncelikli; yalnız Android/Play Store; hesap, reklam, backend, push sunucusu yok. iOS ve App Store ürün, build ve doğrulama kapsamı dışındadır. Kullanıcı kısa bildirim seslerini kabul etti ve hesaplama yaklaşımını teknik değerlendirmeye bıraktı.

Expo + strict TypeScript + Expo Router kökte kuruldu. Sabitlenen sürümler: Expo 57.0.27, RN 0.86.3, React 19.2.3, Adhan 4.4.6, Luxon 3.7.2, Node 24.21.0. Son incelemede kararlı seri SDK 57 (RN 0.86, React 19.2; Android 7+) idi. Registry/resmî doküman doğrulanıp kararlı uyumlu sürümler lockfile'a alındı. Kaynak: [Expo SDK](https://docs.expo.dev/versions/latest/), [SDK 57](https://expo.dev/changelog/sdk-57). Yerel Node v25.2.1 görüldü; proje için Node 24 LTS ayrı yerel dizine kuruldu; global PATH değiştirilmedi. Üretim/export komutları Android ile sınırlıdır; Expo bağımlılıklarındaki ortak platform kodu ürün hedefi anlamına gelmez.

Ürün markası cihaz içinde **Vakitname**, Play Store başlığında **Vakitname: Namaz & Kıble** olarak kesinleşti. Kalıcı Android paket kimliği `com.alemdem.vakitname`, ilk `versionCode` değeri `1` ve uygulama şeması `vakitname`dir. Önceki geliştirme sürümlerinden veri kaybını önlemek için `vakit.state.v1`, bildirim sahiplik değerleri, kanal kimlikleri ve paketlenmiş asset dosya adları iç uygulama kimliği olarak değiştirilmedi.

6 Ekim 2026 mağaza hazırlığında Expo Doctor'ın istediği SDK 57 yama sürümleri uygulandı: Expo `~57.0.27`, Linking `~57.0.12`, Notifications `~57.0.22`, Router `~57.0.25` ve SQLite `~57.0.4`. EAS Update için `expo-updates ~57.0.25` native bağımlılığı eklendi. Uygulama `@alemdem/vakitname` EAS projesine (`e5365686-2c53-4aab-9277-c5989561eea5`) bağlandı; Android runtime politikası `appVersion`, URL `https://u.expo.dev/e5365686-2c53-4aab-9277-c5989561eea5` ve `development`/`preview`/`production` build kanallarıdır. Development ve preview profilleri iç dağıtım APK'sı, production profili Play için AAB üretir. JS/stil/metin/görsel değişiklikleri aynı uygulama sürümündeki uyumlu runtime'a OTA verilebilir; native paket/izin, Expo SDK, config plugin veya native asset değişikliği yeni Android build'i ve uygulama sürümü artışı gerektirir. OTA yayını önce preview kanalında kabul edilir, sonra production kanalına gönderilir. Expo; cihaz işletim sistemi, rastgele güncelleme tokenları, IP/ağ ve kullanım/performans verileri işleyebildiğinden gizlilik politikası, uygulama içi açıklama ve Play Veri Güvenliği taslağı buna göre güncellendi. Henüz update, APK veya AAB yayımlanmadı. Kaynaklar: [EAS Update](https://docs.expo.dev/eas-update/introduction/), [deployment](https://docs.expo.dev/eas-update/deployment/), [Expo gizlilik politikası](https://expo.dev/privacy).

```text
app/                  Router route ve layout dosyaları
src/domain/           prayer, clock, calendar, theme saf kuralları
src/services/         provider adaptörleri, location, storage, notifications
src/features/         home, location, onboarding, settings; ardından calendar/qibla
src/ui/               tokenlar, tekrar kullanılabilir native componentler
src/data/             sürümlü Türkiye konum kataloğu, takvim referansları
src/i18n/             tipli Türkçe sözlük; İngilizceye hazır anahtarlar
assets/               paketlenmiş font/görsel/ses ve lisans bilgileri
tests/                domain, component ve entegrasyon testleri
```

Route dosyaları iş kuralı içermez. Küçük Context + useState deposu kullanılır; saniyelik saat Home içinde, tema saati 15 saniyede güncellenir. Hesaplanan günler memoized; arka planda interval durur. Redux, Zustand, React Query, UI framework ve form framework başlangıç bağımlılığı değil.

Kalıcı durum şeması v3'tür ve `onboardingComplete`, konum, tercihler ve son bildirim kuyruğu özetini tutar. v1/v2 kayıtları açılışta okunur; eski kayıtlara güvenli, kapalı bildirim varsayılanları eklenir. Geçerli v1 konumu varsa onboarding tamamlanmış kabul edilir. Yeni kurulum onboarding'i konumsuz tamamlayabilir; Home mevcut konum seçme durumunu gösterir. Vakit, Hicri ve bildirim tercihleri AppState üzerinden doğrulanıp tek kalıcı tercih kaynağına yazılır.

| Amaç | Paket (bildirim/ses hariç kurulu) |
|---|---|
| Çalışma/navigasyon | expo, react, react-native, expo-router, expo-dev-client ve Router peer bağımlılıkları |
| Vakit / saat dilimi | adhan, luxon |
| Konum / dil | expo-location, expo-localization |
| Kalıcılık | expo-sqlite/kv-store; şema sürümü ve migration |
| Görünüm | expo-font, expo-linear-gradient, react-native-svg |
| Animasyon | react-native-reanimated + SDK uyumlu react-native-worklets |
| Yerel bildirim | expo-notifications 57.0.22; push tokenı veya sunucu yok |
| Uygulama güncellemesi | expo-updates 57.0.25; EAS Update, `appVersion` runtime ve kanallı dağıtım |
| Doğrulama | TypeScript, Expo ESLint yapılandırması, Jest, jest-expo, React Native Testing Library |

Fontlar yerel paketlenecek. `expo-blur` ancak cihaz ölçümü ve ihtiyaç doğrulanırsa. [Depolama](https://docs.expo.dev/versions/latest/sdk/sqlite/), [animasyon](https://docs.expo.dev/versions/latest/sdk/reanimated/), [test](https://docs.expo.dev/develop/unit-testing/).

## Yayın hazırlığı ve splash

Native splash için `expo-splash-screen` mevcut uygulama ikonu ve `#0E1324` başlangıç rengiyle yapılandırıldı. Native katman statik olduğundan, fontlar yüklenirken JavaScript katmanında Stitch `Splash Ekranı` referansının gün batımı gradienti, düşük maliyetli native SVG silüeti, ikon çerçevesi, marka metni, doğrulanmış İsrâ 78 meal/atıfı ve animasyonlu yükleme çizgisi gösterilir. Bu marka yüzeyi fontlar hazır olsa bile en az 900 ms kalır; böylece hızlı cihazlarda tasarım tek karede kaybolmaz. Ayet metni uygulamayla paketlenir; runtime isteği yapılmaz ve kaynak kaydı `DATA-SOURCES.md` içindedir. HTML/WebView ya da uzaktan görsel kullanılmaz. `app.json` değişikliği Expo Go'da native splash'i değiştirmez; yeni native binary/development build gerektirir ve bu çalışma kapsamında üretilmemiştir. Android `icon` ve `adaptiveIcon.foregroundImage` ayrı PNG'lerdir; foreground sembolü güvenli alana küçültülmüş, adaptive arka planı `#06432F` olarak sabitlenmiştir. iOS ikonu ve App Store paketi üretilmez.

`/about` route'u Hakkında, gizlilik özeti, hesaplama/katalog kaynakları ve lisans atıflarını tek yerel ekranda sunar. Bu ekran hukuki danışmanlık veya resmî Diyanet ortaklığı iddiası taşımaz; kullanıcıya uygulamanın ne sakladığını ve hangi kaynakları kullandığını açıklar. Dış bağlantılar yalnız kullanıcı dokunuşuyla açılır.

## Hesaplama ve Diyanet kararı

İlk sağlayıcı cihazda `adhan.CalculationMethod.Turkey()`. Ürün etiketi “Cihazda hesaplama — Türkiye yöntemi”; resmî Diyanet verisi değildir. Kütüphane kendi yöntemini yaklaşık karşılık olarak tanımlar: [yöntem açıklaması](https://github.com/batoulapps/adhan-js/blob/main/METHODS.md).

İncelenen kaynakta Turkey: İmsak 18°, Yatsı 17°; yöntem düzeltmeleri Güneş -7, Öğle +5, İkindi +4, Akşam +7 dakika. Kullanıcı düzeltmeleri bunlardan AYRI ve varsayılan 0 olacak. Yöntem düzeltmelerini yeniden uygulama. İkindi için yalnız Türkiye/Hanefi çağrışımıyla gölge oranını 2 yapma; preset ve gerçek karşılaştırma esas. Kurulu sürümün kaynak/yuvarlama davranışını test et. [CalculationMethod](https://github.com/batoulapps/adhan-js/blob/main/src/CalculationMethod.ts), [CalculationParameters](https://github.com/batoulapps/adhan-js/blob/main/src/CalculationParameters.ts).

Sözleşme: `PrayerTimesProvider.getDay(localDate, location, adjustments) -> PrayerDay`. Sonuç: altı olayın UTC epoch değerleri, seçili yerel tarih, IANA zone, provider/version, yöntem, düzeltmeler ve durum. UI kütüphanenin Date nesnelerini doğrudan tüketmez. Gelecekte resmî tablo sağlayıcısı aynı sözleşmeyi uygular; kaynaklar sessizce karıştırılmaz.

Üretim karşılaştırma politikası: İstanbul, Ankara, İzmir, Antalya, Sinop, Erzurum, Iğdır için dört mevsimden ve Ramazan'dan tarih örnekleri; aynı yer/tarih/zone üzerinden resmî tablolarla vakit bazında işaretli fark, ortalama mutlak fark ve en büyük fark. 2 dakikadan büyük fark mühendislik inceleme eşiğidir, dinî doğruluk onayı değildir. Sistematik farkı tek şehirde rastgele dakika ekleyerek gizleme. Farklar açıklanamıyorsa üretim kabulü durur; resmî verinin erişim/kullanım koşulları doğrulanarak ayrı offline tablo adaptörü değerlendirilir. Matrisin son sonucu VALIDATION.md içindedir; birebir veya gelecekte değişmez uyum iddia edilmez. Diyanet'in yerleşim/coğrafya farkı açıklaması: [temkin](https://vakithesaplama.diyanet.gov.tr/temkin.php).

4 Ekim 2026'da bu matris `scripts/verify-prayer-times.mjs` ile tekrar üretilebilir hale getirildi. Komut yedi ilin canlı Diyanet yıllık tablolarından sonbahar, kış, Ramazan başlangıcı, ilkbahar ve yaz satırlarını alır; paketli il merkezi koordinatları ve sabit Adhan sürümüyle 210 vakti karşılaştırır. 2 dakikayı aşan fark veya eksik resmî satır komutu başarısız yapar. Bu geliştirme/release kontrolüdür; uygulama çalışma zamanında ağ isteği yapmaz. Son ölçümde ortalama mutlak fark 0,41 dakika, en büyük fark 2 dakikadır. Bu sonuç resmî veri kullanımı veya gelecekte değişmezlik garantisi değildir; release ve Adhan/koordinat değişikliklerinde yeniden çalıştırılır.

Kullanıcı düzeltmeleri tamsayı dakika, başlangıç aralığı ±30. Düzeltme vakit sırasını bozarsa kayıt reddedilir ve ilgili satır açıklanır. UI, sayaç ve bildirim tek düzeltilmiş olay setini kullanır. Kesin zaman ve gösterilen dakika aynı yuvarlama politikasını izler.

## Zaman, konum ve offline davranış

- `Clock.now()` enjekte edilebilir. Sayaç `max(0, targetEpoch-now)`; interval yalnız render tetikleyicisi. Arka planda sayaç çalıştırma.
- Türkiye konumunda zone `Europe/Istanbul`; cihaz başka zone'a geçse de manuel Türkiye şehrinin vakitleri değişmez. UTC+3 sabitini yayma.
- Gün hesabı location zone'undaki yıl/ay/gündür. Adhan'ın yerel Date getter'ları nedeniyle adaptörde civil date köprüsü kur; `new Date('YYYY-MM-DD')` ile örtük UTC dönüşümüne güvenme. [Adhan tarih yardımcıları](https://github.com/batoulapps/adhan-js/blob/main/src/DateUtils.ts).
- Dün/bugün/yarın olayları birleştirilir. `at <= now` girilmiş, `at > now` sıradaki. Yatsı sonrası ertesi gün İmsak; gece yarısından sonra hedef bugün olur. `+24 saat` yerine takvim günü artırılır.
- Güneş sıradaki takvim olayı olabilir; sıradaki namaz ayrıca türetilir. Güneş için ezan yok, doğuş bildirimi varsayılan kapalı. Sayaç halkası önceki ve sonraki olay arasında [0,1] oranı.
- Açılış, foreground, gün değişimi, saat sıçraması, konum/yöntem/düzeltme değişimi yeniden hesaplatır. Kayıtlı konum GPS kaynaklıysa soğuk açılışta ve foreground dönüşünde yeni izin diyaloğu açmadan tek dengeli doğruluk ölçümü istenir. Ölçüm/izin hatasında son geçerli konum korunur ve kullanıcı manuel yenileme veya şehir seçimine devam edebilir. Hızlı konum değişiminde eski async sonuç yeni seçimi ezemez; revision/request ID kullanılır.
- İlk açılışta konum yoksa kullanıcı GPS veya manuel il/ilçe seçer; gizlice İstanbul varsayılmaz. Ön plan izni yeterli. Manuel seçim otomatik GPS yenilemesiyle değiştirilmez.
- Kayıt: kaynak gps/manual, koordinat, doğruluk varsa, ölçüm zamanı, görünen yer etiketi, zone, katalog ID'si. Son geçerli kayıt offline açılır; yenileme hatası mevcut vakitleri silmez.
- GPS koordinatı sınır/konum doğrulamasından geçer. Türkiye dışı konumda manuel Türkiye seçimi sun; küresel destek iddia etme. Hassas koordinat loglanmaz veya servise gönderilmez. Yer etiketi offline katalogdan yaklaşık atanır; yakın merkez kesin ilçe sınırı tespiti diye sunulmaz.
- Manuel katalog 81 il ve ilçe merkezlerinin gerçek koordinatları/zone'larıyla paketlenecek. Kaynak sürümü, eksik kayıt denetimi ve atıf gerekli. GeoNames verisi paketlendi: 81 il, 974 ADM2 kaydı, 29 yaklaşık temsil koordinatı; resmî ilçe kapsamı henüz doğrulanmadı. Atıf ve üretim betiği DATA-SOURCES.md içinde. [GeoNames](https://www.geonames.org/export/).
- Ay/yıl vakitleri ihtiyaçta cihazda hesaplanabilir; önceden bir yıllık vakit indirmek gerekmez. Cache anahtarı: koordinat+zone+tarih+provider/version+ayarlar. Tercihler için versioned storage; bozuk kayıt kontrollü kurtarılır.
- Namaz vakti hesabının takvim yılı sonu yoktur: 2027, 2028 ve sonraki civil tarihler aynı astronomik sağlayıcıyla çevrimdışı hesaplanır. Sabitlenen kütüphane/yöntem kendiliğinden güncellenmez; değişiklik ancak uygulama sürümü ve doğrulama matrisiyle yapılır.

## Kıble

Kıble hesabı `src/domain/qibla.ts` içindeki saf büyük çember başlangıç doğrultusu ve Haversine mesafesiyle, sabit Kâbe WGS84 noktası üzerinden yapılır. Sonuç gerçek kuzeye göre derece ve kuş uçuşu kilometredir; telefon sensörü olmasa da çalışır. Pusula katmanı `expo-location` `watchHeadingAsync` adaptörüdür; kurulu SDK 57 paketi yeni bağımlılık eklemeden gerçek-kuzey (`trueHeading`), manyetik-kuzey ve 0–3 hassasiyet bilgisini ayırır. [Expo Location heading API](https://docs.expo.dev/versions/latest/sdk/location/).

Canlı hizalama yalnız `trueHeading` geldiğinde gösterilir. Konum izni yoksa kullanıcı isterse sistem iznini etkinleştirir; yalnız manyetik başlık geldiğinde manyetik sapma düzeltilmediğinden hizalama iddiası yapılmaz. Düşük hassasiyet kalibrasyon önerisi verir, hizalanmış ile aynı anda gösterilmez. Başlık aboneliği yalnız Kıble ekranı öndeyken açıktır ve ekran kapanınca temizlenir. Cihaz/sensör desteği Expo Go gerçek ortamında ayrıca doğrulanmalıdır.

## Hicri takvim ve Ramazan

`CalendarProvider` prayer provider'dan bağımsızdır. Plan: lisans/yeniden kullanım koşulları doğrulanmış resmî Türkiye ay başlangıçlarını sınırlı yıl aralığı için paketlemek; aralık dışında açıkça isimlendirilmiş hesaplanan takvim fallback'i (`Intl` islamic-umalqura, Hermes desteği doğrulanarak). Kaynak ve kapsanan yıllar metadata olur. Umm al-Qura ile Diyanet eşit varsayılmaz. ±2 günlük düzeltme UI/provider üzerinde tek noktada uygulanır; UTC vakitlerini değiştirmez.

Üstteki Miladi/Hicri tarih çifti takvimde o civil güne karşılık gelir. Akşam başlayan dinî gece ayrı türetilir; oruç günü/sahur hedefi civil güne bağlıdır. Ramazan atmosfer aralığı ilk oruç gününden önceki yerel gün batımından son oruç gününün gün batımına kadardır. Gecede yarın oruç varsa sonraki İmsak; oruç gününde İmsak–Akşam arasında İftar; son iftar sonrasında Ramazan dışı davranış. “Ramazan N. gün” etiketi gece/civil gün ayrımını yanlış göstermemeli; Ramazan arifesinde “Ramazan başlıyor” kullanılabilir.

Ramazan atmosferi kapalı değilse Home ana halkası gece/sahur aralığında “İmsaka kalan süre”, oruç süresinde “İftara kalan süre” hedefini kullanır. İmsak ve Akşam kartları ilgili oruç gününün saatini ve kalan süreyi; geçmiş olay için “Vakti geçti” durumunu gösterir. Normal sıradaki namaz hedefi Ramazan hedefinden farklıysa ayrıca küçük bilgi olarak korunur. `on` ile Ramazan dışı görsel önizleme sahte oruç hedefi veya sayaç üretmez.

Resmî test referansı: 2026 ilk oruç 19 Şubat, son oruç 19 Mart, bayram başlangıcı 20 Mart; ayı 30 gün sabitleme. [Diyanet 2026](https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=153), [Hicri fark açıklaması](https://vakithesaplama.diyanet.gov.tr/hicri_farki.php). Olgusal ay başlangıçları 2025-12-21–2029-01-16 (son tarih hariç) aralığı için paketlendi; 2026–2028 tam kapsanır. Bu aralığın dışında açıkça `umm-al-qura` olarak etiketlenen cihaz hesabı kullanılır; DATA-SOURCES.md.

Namaz vakitleri için yıllık dosya eklenmez: Adhan sağlayıcısı tarih ve konumdan çevrimdışı hesap yaptığı için 2029, 2030 ve sonrası otomatik çalışır. Resmî Türkiye Hicrî ay başlangıçlarını uzatmak istendiğinde Diyanet'in ilgili yıl sayfası yayımlandıktan sonra yalnız ay başlangıçlarını `hijri-months.ts` içine ekle, bir sonraki ayın ilk gününü sınır/sentinel olarak koy, kaynak tablosu ile UI kapsam metnini güncelle ve Ramazan sınırı regresyon testlerini çalıştır. Yeni veri runtime ağ isteği oluşturmaz.

## Erişilebilirlik

TalkBack, Android'in ekran okuyucusudur; Vakit bunu kullanan bir `AccessibilityService` değildir, bu nedenle özel erişilebilirlik izni, servis manifesti veya Play Console Accessibility API beyanı gerekmez. Buna karşılık tüm etkileşimli kontrollerin erişilebilir adı/rolü, seçili durumu ve dinamik hata/durum metinleri ekran okuyucuyla anlaşılır olmalıdır. Mevcut native etiketler ve büyük yazı kontrolleri test edilmiştir; gerçek TalkBack turu kalite kabulü olarak açık tutulur. [Android erişilebilirlik rehberi](https://developer.android.com/guide/topics/ui/accessibility/apps).

## Tek Home ve tema

`resolveTheme({season, solarPhase, ramadan, preferences}) -> ThemeTokens`. Ayrı mevsim ekranı yok. Türkiye için meteorolojik mevsim (Mar–May, Haz–Ağu, Eyl–Kas, Ara–Şub). Mevsim seçimi ve ışık tercihi ayrı: season auto/fixed; kullanıcıya sunulan appearance solar veya sabit dawn/day/sunset/night; Ramadan auto/on/off. Eski v3 kayıtlarındaki system/light/dark değerleri sırasıyla solar/day/night olarak okunur; bu seçenekler yeni UI'da sunulmaz. Sabit faz seçimi hesaplanan güneş fazını yalnız tema için geçersiz kılar ve v3 state içindeki mevcut `appearance` alanında geriye uyumlu saklanır; şema sürümü artmaz. Ramazan katmanı açıkken seçilen ışık fazı korunur; normal mevsim paleti yerine gündüzde fildişi–yeşil, koyu fazlarda zümrüt–lacivert ve altın vurgulu özel palet ile hafif hilal/yıldız dekoru kullanılır. Varsayılan `auto`, yukarıdaki gerçek Ramazan atmosfer aralığında kendiliğinden açılır; `off` bunu kapatır. `on` yalnız görünümü Ramazan dışında önizlemeye zorlar, dinî tarihi/gerçek oruç gününü değiştirmez.

Solar faz astronomik doğuş/batış verilerinden türetilir; kullanıcı vakit düzeltmeleri gökyüzünü değiştirmez. İlk politika: şafak doğuştan 45 dk önce–15 dk sonra; gün batımı batıştan 45 dk önce–30 dk sonra; arası gündüz, kalanı gece. Bunlar görsel eşiklerdir, dinî vakit iddiası değil. Tokenlar renk, metin, yüzey, border, halka, dekor ve status bar'ı kapsar. Manuel seçim ve 15 saniyelik saat kontrolüyle oluşan otomatik faz değişimi aynı global Backdrop geçişini kullanır: yeni palet opak taban olarak çizilir, önceki gradient/dekor bunun üzerinde korunup 320 ms'de söner; kart ve metin renklerinin değişimi de 280 ms'lik %12 koyu üst perdeyle yumuşatılır. İki yarı saydam gradienti beyaz taban üzerinde birlikte eritmek beyaz-gri ara flaş ürettiği için kullanılmaz. Ekran ağacı yeniden kurulmaz; açık ekran durumu korunur. Stack'te odakta olmayan ekranlar tema değişiminde dondurulur; tema sağlayıcısı yalnız konum, hesap düzeltmeleri, Hicri düzeltme ve tema tercihi değişimlerinde astronomik veriyi yeniden çözer. Halka ve tema geçişleri sistemin hareketi azalt tercihine uyar.

## Aylık takvim ve Ramazan imsakiyesi

Takvim route'u tek native ekran içinde iki görünüm sunar: seçili Miladi ayın tüm vakitleri ve doğrulanmış Ramazan aralığının İmsak/Akşam/Yatsı tablosu. `calendar-table.ts` tarih aralığı üretimini, Hicri gösterim offset'ini ve satır seçimini UI'dan ayırır; saatleri verilen `PrayerTimesProvider` üretir. Böylece tablo örnek saat saklamaz ve ileride resmî/offline provider eklenebilir.

Ramazan aralığı önce `hijri-months.ts` içindeki kaynaklı Türkiye ay başlangıçlarından seçilir. Paket kapsamı dışındaki yıllarda cihazın `Intl` Umm al-Qura fallback'i ayın 1. gününü ve bir sonraki ay sınırını bulmak için kullanılır; bu sonuç Diyanet ile eşit veya resmî kabul edilmez. Kullanıcı Hicri düzeltmesi yalnız gösterilen Hicri etiketi değiştirir; Ramazan aralığı ve namaz olayları gerçek civil tarih/provider verisinden kalır. Tablo yatay native `ScrollView` ile taşmadan tüm vakitleri gösterir.

Takvimde 29–31 günlük Adhan hesabı route/sekme geçişini bloke etmez: veri `requestIdleCallback` ile ilk ekran karesi çizildikten sonra hazırlanır ve kısa bir yükleniyor yüzeyi gösterilir. Son 12 tablo sınırlı bellekte tutulur; aynı sekme veya aya dönüş doğrudan önbellekten gelir. `AdhanProvider` da konum+tarih+düzeltme anahtarıyla son 400 günü LRU olarak saklar; Home, tema, bildirim ve takvim aynı günü tekrar hesaplamaz. Konum veya kullanıcı düzeltmesi anahtarı değiştirdiği için eski sonuç yeni seçime sızmaz.

## Yerel bildirimler (Home sonrasındaki aşama)

`NotificationPlanner` saf olay planı üretir; `NotificationScheduler` platforma uygular. Push tokenı/FCM/APNs gönderim sunucusu kullanılmaz. Her güne ayrı tarih tetikleyici; sabit günlük tekrar vakitlerin mevsimsel değişimini karşılamaz.

- İzin ve kullanıcı vakit tercihleriyle yalnız gelecek olaylar planlanır. İmsak/Öğle/İkindi/Akşam/Yatsı, kısa ses; Güneş ayrıca isteğe bağlı. Ön hatırlatma varsayılan kapalı. Doğal içerik başlıkları kullanılır.
- Güncel kuyruk bugün dahil 15 yerel takvim günüdür; en fazla 180 olay. Önceki 60 olay sınırı kaldırılmıştır. Sınır, Android pending listesini ölçülü tutan uygulama politikasıdır.
- Gerçek pending listesiyle idempotent uzlaştırma; sabit olay kimlikleri, hesaplama revision'ı, başarısız/kısmi planlamayı kaydetme. Çift bildirim yok. Konum değişince eski konum olayları temizlenir; değişim sırasında kapasite aşılmaz.
- Uygulanan yenileme tetikleyicileri: state hazır olduğunda açılış, foreground dönüşü, konum, düzeltme ve bildirim tercihi değişimi; elle yeniden deneme ve desteklenen Android binary'de günlük arka plan görevi. Bağımsız gün/saat/zone dinleyicisi yoktur. Son planlanan tarih yardım ekranında gösterilir; arka plan görevi sistemce uzun süre engellenirse son planlanan olaydan sonra teslim devam etmez.
- Yenilemeler tek seferde bir uzlaştırma çalıştırır. Çalışan işlem sırasında gelen birden fazla tetikleyici en güncel konum/tercih anlık görüntüsünde birleşir; eski ara durumlar için paralel native zamanlama çağrıları yapılmaz.
- Android sessiz/DND tercihlerini aşma iddiası yoktur; kanal davranışında son söz sistem ve kullanıcı ayarındadır.
- Android 13+ bildirim izni kullanılır. Android 12+ için kullanıcıya nedenini açıklayan ayrı bir eylemle `SCHEDULE_EXACT_ALARM` özel erişim ekranı açılır; Play'de daha kısıtlı olan `USE_EXACT_ALARM` kullanılmaz. Erişim verilirse Expo Notifications tarih tetikleyicilerini `setExactAndAllowWhileIdle`, verilmezse `setAndAllowWhileIdle` ile planlar. Reddedilmesi uygulamanın diğer işlevlerini engellemez. [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/), [Android exact alarm değişikliği](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms), [Google Play exact alarm politikası](https://support.google.com/googleplay/android-developer/answer/16558241).
- Arka plan yenilemesi yalnız yardımcı optimizasyon olabilir; offline çalışma veya tam vakitte teslim ona bağlı olamaz. OS çalışma zamanını belirler. [Expo BackgroundTask](https://docs.expo.dev/versions/latest/sdk/background-task/).

5 Ekim 2026 arka plan yenilemesi: SDK uyumlu `expo-background-task ~57.0.21` ve `expo-task-manager ~57.0.21`, `expo install` ve lockfile ile eklendi. `index.js` görevi Router'dan önce global kapsamda tanımlar. Android WorkManager üzerinden minimum **1440 dakika** aralık istenir; foreground dönüşleri mevcut kaydı tekrar kurup süreyi sıfırlamaz. Görev SQLite'daki doğrulanmış son konum/tercihlerden 15 günlük planı hesaplar; GPS, sensör, sunucu isteği, sürekli servis ve JS interval kullanmaz. Mevcut pending kayıtlar korunur, yalnız fark uygulanır. Bildirim/izin kapalı veya konum/etkin olay yoksa kuyruk temizlenir ve görev kaydı kaldırılır. Bozuk/okunamayan state mevcut kuyruğu silmez; başarısız görev sonraki çalışmada tekrar denenebilir.

UI ve headless görev aynı modül düzeyindeki seri işlem kuyruğunu kullanır. UI belleğindeki daha yeni tercih, gecikmeli SQLite yazısına tercih edilir; arka plan görevi tüm state'i geri yazıp kullanıcı ayarını ezmez. Açılış/foreground native planı tekrar okur ve UI özetini günceller. Günlük 15 günlük hesap bounded'dır (en fazla 180 olay); pil tüketimi cihazda henüz ölçülmedi.

Sınırlar: SDK 57 `BackgroundTaskScheduler.kt` ağ koşulunu `NetworkType.CONNECTED` olarak sabitliyor; görev kendi ağ isteğini yapmasa da sistem bağlantı bekler. Mevcut alarmlar ve uygulama açılışında yenileme internetsiz çalışır; 15 günden uzun kesintisiz offline/headless devamlılık garanti edilmez. Android Expo Go'da TaskManager kullanılamadığından görev kaydedilmez; yardım ekranı bunu açık gösterir. Uygulamanın kendi native binary'sinde günlük çalışma, reboot, Doze, force-stop ve enerji kabulü gereklidir. Kaynaklar: [BackgroundTask SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/background-task/), [TaskManager SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/task-manager/); paket kaynakları 5 Ekim 2026'da kontrol edildi.
- Cihaz testi: izin ret/geri alma, reboot, force-stop, ekran kilidi, pil tasarrufu, ses/kanal değişimi, timezone/saat değişimi. Gerçek capability okunamıyorsa “bilinmiyor” göster; skor uydurma.

Uygulanan Faz 3 dilimi: `buildNotificationPlan` saf olarak bugün dahil 15 yerel takvim gününün olaylarını üretir. İmsak/Öğle/İkindi/Akşam/Yatsı varsayılan açık, Güneş kapalıdır; vakit anı ve 15/30/45 dakika ön hatırlatma birlikte seçilebilir. En yoğun seçim 6 vakit × 2 tür × 15 gün = 180 kayıtlık açık güvenlik sınırındadır. Kimlik vakit epoch'u, olay, hatırlatma ve ses tercihini içerir; konum, düzeltme, ses veya per-vakit anahtarı değişince gerçek pending listeyle fark alınır, artık istenmeyen kayıtlar iptal edilir ve eksikler eklenir. Örneğin Öğle kapatıldığında planlanan Öğle ön-hatırlatma ve vakit-anı kayıtları silinir. Uygulamaya ait olmayan pending bildirimlere dokunulmaz.

Uzlaştırma hatasında tercih geri alınmaz veya son başarılı plan özeti sahte biçimde değiştirilmez; ekranda canlı hata mesajı ve **Planı yeniden dene** eylemi gösterilir. Ayrıca uygulamanın bir sonraki foreground geçişi otomatik yeniden dener. Yenileme kuyruğu aynı anda tek native işlem çalıştırır ve üst üste gelen tercih değişikliklerinde yalnız en güncel anlık görüntüyü uygular.

Android'de sesli ve sessiz iki versioned kanal kullanılır. `SCHEDULE_EXACT_ALARM` app config'dedir; Bildirimler ve yardım ekranı kullanıcıyı Android'in **Alarmlar ve hatırlatıcılar** sayfasına götürür. Bu özel erişim normal runtime izni değildir: React Native `PermissionsAndroid.check()` erişim açıkken de güvenilir bir açık/kapalı sonucu vermediği için uygulama sahte durum etiketi göstermez, **Sistem ayarı** der. Kullanıcı ayar ekranından döndüğünde bütün Vakit kayıtları iptal edilip güncel konum ve tercihlerle yeniden kurulur; böylece açık erişim kesin tetikleyiciye, kapalı erişim güvenli yaklaşık fallback'e dönüşür. Android 13+ bildirim izni ayrıca `PermissionsAndroid` ile okunur/istenir. Özgün `vakit-tone.wav` config plugin ile native bundle'a alınır.

Expo SDK 57 dokümanı yerel bildirimlerin Expo Go'da kaldığını belirtir. Android Expo Go 57.0.9'da public paket girişi kaldırılan push modülü nedeniyle, kanal yöneticisi de eksik native provider nedeniyle hata verdi. Adaptör Expo Go'da yalnız yerel zamanlama alt modüllerini dinamik yükler ve varsayılan Expo kanalını kullanır; standalone/development build public paket girişi ile Vakit kanallarını kullanır. Böylece Expo Go'da izin, pending kuyruk ve varsayılan sesli teslim test edilebilir; özgün ses ve sessiz kanal bu ortamdan kanıtlanmaz. Bu uyumluluk yolu sadece geliştirme istemcisidir ve Expo sürüm yükseltmesinde yeniden kontrol edilir. Kaynaklar: [Expo Notifications SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/notifications/), [Expo izinleri](https://docs.expo.dev/guides/permissions/).

Fiziksel kabul için Bildirimler ekranındaki **Seçili akışı simüle et** düğmesi cihaz saatini veya gerçek bildirim kuyruğunu değiştirmez. Etkin ön-hatırlatma seçimini 3 saniye, vakit-anı seçimini 6 saniye sonra ayrı yerel test bildirimleri olarak üretir; her ikisi kapalıysa bildirim üretmez. Test kayıtları gerçek `vakit` planından ayrı bir sahiplik etiketi taşır. Expo Go'da bu bildirimler de varsayılan Expo kanalına ve dolayısıyla Android'in sistem bildirim sesine düşer. Özgün Vakit tonu ile sessiz kanalın uçtan uca ses davranışı yalnız native development/production build'de kabul edilir.
