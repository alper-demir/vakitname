# Teknik kararlar

Durum: ilk dikey dilim uygulandı; native cihaz doğrulaması açık. Güncel kanıtlar VALIDATION.md, kaynaklar DATA-SOURCES.md içinde. Kaynak incelemesi: 30 Eylül 2026.

## Kapsam ve yapı

Türkiye; Türkçe öncelikli; iOS/Android; hesap, reklam, backend, push sunucusu yok. Kullanıcı kısa bildirim seslerini kabul etti ve hesaplama yaklaşımını teknik değerlendirmeye bıraktı.

Expo + strict TypeScript + Expo Router kökte kuruldu. Sabitlenen sürümler: Expo 57.0.26, RN 0.86.3, React 19.2.3, Adhan 4.4.6, Luxon 3.7.2, Node 24.21.0. Son incelemede kararlı seri SDK 57 (RN 0.86, React 19.2; iOS 16.4+, Android 7+) idi. Registry/resmî doküman doğrulanıp kararlı uyumlu sürümler lockfile'a alındı. Kaynak: [Expo SDK](https://docs.expo.dev/versions/latest/), [SDK 57](https://expo.dev/changelog/sdk-57). Yerel Node v25.2.1 görüldü; proje için Node 24 LTS ayrı yerel dizine kuruldu; global PATH değiştirilmedi. Windows'ta iOS build/cihaz doğrulaması EAS veya macOS gerektirir; bunu geçilmiş sayma.

```text
app/                  Router route ve layout dosyaları
src/domain/           prayer, clock, calendar, theme saf kuralları
src/services/         provider adaptörleri, location, storage, notifications
src/features/         home, location; ardından settings/calendar/qibla
src/ui/               tokenlar, tekrar kullanılabilir native componentler
src/data/             sürümlü Türkiye konum kataloğu, takvim referansları
src/i18n/             tipli Türkçe sözlük; İngilizceye hazır anahtarlar
assets/               paketlenmiş font/görsel/ses ve lisans bilgileri
tests/                domain, component ve entegrasyon testleri
```

Route dosyaları iş kuralı içermez. Küçük Context + useState deposu kullanılır; saniyelik saat Home içinde, tema saati 15 saniyede güncellenir. Hesaplanan günler memoized; arka planda interval durur. Redux, Zustand, React Query, UI framework ve form framework başlangıç bağımlılığı değil.

| Amaç | Paket (bildirim/ses hariç kurulu) |
|---|---|
| Çalışma/navigasyon | expo, react, react-native, expo-router, expo-dev-client ve Router peer bağımlılıkları |
| Vakit / saat dilimi | adhan, luxon |
| Konum / dil | expo-location, expo-localization |
| Kalıcılık | expo-sqlite/kv-store; şema sürümü ve migration |
| Görünüm | expo-font, expo-linear-gradient, react-native-svg |
| Animasyon | react-native-reanimated + SDK uyumlu react-native-worklets |
| Sonraki aşama | expo-notifications; ses önizlemesi gerektiğinde expo-audio |
| Doğrulama | TypeScript, Expo ESLint yapılandırması, Jest, jest-expo, React Native Testing Library |

Fontlar yerel paketlenecek. `expo-blur` ancak cihaz ölçümü ve ihtiyaç doğrulanırsa. [Depolama](https://docs.expo.dev/versions/latest/sdk/sqlite/), [animasyon](https://docs.expo.dev/versions/latest/sdk/reanimated/), [test](https://docs.expo.dev/develop/unit-testing/).

## Hesaplama ve Diyanet kararı

İlk sağlayıcı cihazda `adhan.CalculationMethod.Turkey()`. Ürün etiketi “Cihazda hesaplama — Türkiye yöntemi”; resmî Diyanet verisi değildir. Kütüphane kendi yöntemini yaklaşık karşılık olarak tanımlar: [yöntem açıklaması](https://github.com/batoulapps/adhan-js/blob/main/METHODS.md).

İncelenen kaynakta Turkey: İmsak 18°, Yatsı 17°; yöntem düzeltmeleri Güneş -7, Öğle +5, İkindi +4, Akşam +7 dakika. Kullanıcı düzeltmeleri bunlardan AYRI ve varsayılan 0 olacak. Yöntem düzeltmelerini yeniden uygulama. İkindi için yalnız Türkiye/Hanefi çağrışımıyla gölge oranını 2 yapma; preset ve gerçek karşılaştırma esas. Kurulu sürümün kaynak/yuvarlama davranışını test et. [CalculationMethod](https://github.com/batoulapps/adhan-js/blob/main/src/CalculationMethod.ts), [CalculationParameters](https://github.com/batoulapps/adhan-js/blob/main/src/CalculationParameters.ts).

Sözleşme: `PrayerTimesProvider.getDay(localDate, location, adjustments) -> PrayerDay`. Sonuç: altı olayın UTC epoch değerleri, seçili yerel tarih, IANA zone, provider/version, yöntem, düzeltmeler ve durum. UI kütüphanenin Date nesnelerini doğrudan tüketmez. Gelecekte resmî tablo sağlayıcısı aynı sözleşmeyi uygular; kaynaklar sessizce karıştırılmaz.

Üretim öncesi karşılaştırma: İstanbul, Ankara, İzmir, Antalya, Sinop, Erzurum, Iğdır için dört mevsimden ve Ramazan'dan tarih örnekleri; aynı yer/tarih/zone üzerinden resmî tablolarla vakit bazında işaretli fark, ortalama mutlak fark ve en büyük fark. Kaynak URL/tarih ve karşılaştırma koordinatı kaydedilecek. 2 dakikadan büyük fark mühendislik inceleme eşiğidir, dinî doğruluk onayı değildir. Sistematik farkı tek şehirde rastgele dakika ekleyerek gizleme. Farklar açıklanamıyorsa üretim kabulü durur; resmî verinin erişim/kullanım koşulları doğrulanarak ayrı offline tablo adaptörü değerlendirilir. İlk İstanbul örneği VALIDATION.md içinde; tam matris yapılmadı ve birebir uyum kanıtlanmadı. Diyanet'in yerleşim/coğrafya farkı açıklaması: [temkin](https://vakithesaplama.diyanet.gov.tr/temkin.php).

Kullanıcı düzeltmeleri tamsayı dakika, başlangıç aralığı ±30. Düzeltme vakit sırasını bozarsa kayıt reddedilir ve ilgili satır açıklanır. UI, sayaç ve bildirim tek düzeltilmiş olay setini kullanır. Kesin zaman ve gösterilen dakika aynı yuvarlama politikasını izler.

## Zaman, konum ve offline davranış

- `Clock.now()` enjekte edilebilir. Sayaç `max(0, targetEpoch-now)`; interval yalnız render tetikleyicisi. Arka planda sayaç çalıştırma.
- Türkiye konumunda zone `Europe/Istanbul`; cihaz başka zone'a geçse de manuel Türkiye şehrinin vakitleri değişmez. UTC+3 sabitini yayma.
- Gün hesabı location zone'undaki yıl/ay/gündür. Adhan'ın yerel Date getter'ları nedeniyle adaptörde civil date köprüsü kur; `new Date('YYYY-MM-DD')` ile örtük UTC dönüşümüne güvenme. [Adhan tarih yardımcıları](https://github.com/batoulapps/adhan-js/blob/main/src/DateUtils.ts).
- Dün/bugün/yarın olayları birleştirilir. `at <= now` girilmiş, `at > now` sıradaki. Yatsı sonrası ertesi gün İmsak; gece yarısından sonra hedef bugün olur. `+24 saat` yerine takvim günü artırılır.
- Güneş sıradaki takvim olayı olabilir; sıradaki namaz ayrıca türetilir. Güneş için ezan yok, doğuş bildirimi varsayılan kapalı. Sayaç halkası önceki ve sonraki olay arasında [0,1] oranı.
- Açılış, foreground, gün değişimi, saat sıçraması, konum/yöntem/düzeltme değişimi yeniden hesaplatır. Hızlı konum değişiminde eski async sonuç yeni seçimi ezemez; revision/request ID kullanılacak.
- İlk açılışta konum yoksa kullanıcı GPS veya manuel il/ilçe seçer; gizlice İstanbul varsayılmaz. Ön plan izni yeterli. Manuel seçim otomatik GPS yenilemesiyle değiştirilmez.
- Kayıt: kaynak gps/manual, koordinat, doğruluk varsa, ölçüm zamanı, görünen yer etiketi, zone, katalog ID'si. Son geçerli kayıt offline açılır; yenileme hatası mevcut vakitleri silmez.
- GPS koordinatı sınır/konum doğrulamasından geçer. Türkiye dışı konumda manuel Türkiye seçimi sun; küresel destek iddia etme. Hassas koordinat loglanmaz veya servise gönderilmez. Yer etiketi offline katalogdan yaklaşık atanır; yakın merkez kesin ilçe sınırı tespiti diye sunulmaz.
- Manuel katalog 81 il ve ilçe merkezlerinin gerçek koordinatları/zone'larıyla paketlenecek. Kaynak sürümü, eksik kayıt denetimi ve atıf gerekli. GeoNames verisi paketlendi: 81 il, 974 ADM2 kaydı, 29 yaklaşık temsil koordinatı; resmî ilçe kapsamı henüz doğrulanmadı. Atıf ve üretim betiği DATA-SOURCES.md içinde. [GeoNames](https://www.geonames.org/export/).
- Ay/yıl vakitleri ihtiyaçta cihazda hesaplanabilir; önceden bir yıllık vakit indirmek gerekmez. Cache anahtarı: koordinat+zone+tarih+provider/version+ayarlar. Tercihler için versioned storage; bozuk kayıt kontrollü kurtarılır.

## Hicri takvim ve Ramazan

`CalendarProvider` prayer provider'dan bağımsızdır. Plan: lisans/yeniden kullanım koşulları doğrulanmış resmî Türkiye ay başlangıçlarını sınırlı yıl aralığı için paketlemek; aralık dışında açıkça isimlendirilmiş hesaplanan takvim fallback'i (`Intl` islamic-umalqura, Hermes desteği doğrulanarak). Kaynak ve kapsanan yıllar metadata olur. Umm al-Qura ile Diyanet eşit varsayılmaz. ±2 günlük düzeltme UI/provider üzerinde tek noktada uygulanır; UTC vakitlerini değiştirmez.

Üstteki Miladi/Hicri tarih çifti takvimde o civil güne karşılık gelir. Akşam başlayan dinî gece ayrı türetilir; oruç günü/sahur hedefi civil güne bağlıdır. Ramazan atmosfer aralığı ilk oruç gününden önceki yerel gün batımından son oruç gününün gün batımına kadardır. Gecede yarın oruç varsa sonraki İmsak; oruç gününde İmsak–Akşam arasında İftar; son iftar sonrasında Ramazan dışı davranış. “Ramazan N. gün” etiketi gece/civil gün ayrımını yanlış göstermemeli; Ramazan arifesinde “Ramazan başlıyor” kullanılabilir.

Resmî test referansı: 2026 ilk oruç 19 Şubat, son oruç 19 Mart, bayram başlangıcı 20 Mart; ayı 30 gün sabitleme. [Diyanet 2026](https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=153), [Hicri fark açıklaması](https://vakithesaplama.diyanet.gov.tr/hicri_farki.php). Olgusal ay başlangıçları 2025-12-21–2027-12-29 (son tarih hariç) aralığı için paketlendi; DATA-SOURCES.md.

## Tek Home ve tema

`resolveTheme({season, solarPhase, ramadan, preferences}) -> ThemeTokens`. Ayrı mevsim ekranı yok. Türkiye için meteorolojik mevsim (Mar–May, Haz–Ağu, Eyl–Kas, Ara–Şub). Mevsim seçimi ve aydınlık tercihi ayrı: season auto/fixed; appearance solar/system/light/dark; Ramadan auto/on/off. Öncelik: kullanıcının açık aydınlık/mevsim tercihi korunur; Ramazan aksan/dekor katmanıdır. `on` yalnız görünümü zorlar, dinî tarihi/gerçek oruç gününü değiştirmez.

Solar faz astronomik doğuş/batış verilerinden türetilir; kullanıcı vakit düzeltmeleri gökyüzünü değiştirmez. İlk politika: şafak doğuştan 45 dk önce–15 dk sonra; gün batımı batıştan 45 dk önce–30 dk sonra; arası gündüz, kalanı gece. Bunlar görsel eşiklerdir, dinî vakit iddiası değil. Tokenlar renk, metin, yüzey, border, halka, dekor ve status bar'ı kapsar. Halka ve ilk görünüm geçişi azaltılmış harekete uyar. Palet renk interpolasyonu henüz uygulanmadı.

## Yerel bildirimler (Home sonrasındaki aşama)

`NotificationPlanner` saf olay planı üretir; `NotificationScheduler` platforma uygular. Push tokenı/FCM/APNs gönderim sunucusu kullanılmaz. Her güne ayrı tarih tetikleyici; sabit günlük tekrar vakitlerin mevsimsel değişimini karşılamaz.

- İzin ve kullanıcı vakit tercihleriyle yalnız gelecek olaylar planlanır. İmsak/Öğle/İkindi/Akşam/Yatsı, kısa ses; Güneş ayrıca isteğe bağlı. Ön hatırlatma varsayılan kapalı. Doğal içerik başlıkları kullanılır.
- En yakın 60 olaylık kuyruk başlangıç politikası; gün sayısı açık bildirimlere göre değişir. iOS'taki 64 sayısı eski Apple API belgesinde var; güncel cihazlarda davranış doğrulanmadan mutlak yeni API garantisi sayılmaz. [Apple eski limit](https://developer.apple.com/documentation/uikit/uilocalnotification).
- Gerçek pending listesiyle idempotent uzlaştırma; sabit olay kimlikleri, hesaplama revision'ı, başarısız/kısmi planlamayı kaydetme. Çift bildirim yok. Konum değişince eski konum olayları temizlenir; değişim sırasında kapasite aşılmaz.
- Açılış/foreground, konum, gün/saat/zone, yöntem, düzeltme ve bildirim tercihi değişiminde yenile. Son planlanan tarihi sakla ve yardım ekranında göster. Uygulama açılmadan sonsuz yenileme garantisi yok.
- iOS özel ses <30 saniye; sessiz/Focus tercihlerini aşma iddiası yok. [Apple ses](https://developer.apple.com/documentation/usernotifications/unnotificationsound).
- Android 13+ bildirim izni; 12+ kesin alarm yetkisi; 14'te çoğu yeni kurulumda kesin alarm varsayılan kapalı. Kanal sesini kullanıcı yönetebilir; ses değişiminde versioned channel stratejisi. Expo'nun yetki kontrolü/yönlendirme desteği kurulu sürümde incelenecek; eksikse küçük platform adaptörü. Yetkisiz durumda kesinlik vaadi veya gizli crash yok. [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/), [Android kesin alarm](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms).
- Arka plan yenilemesi yalnız yardımcı optimizasyon olabilir; offline çalışma veya tam vakitte teslim ona bağlı olamaz. OS çalışma zamanını belirler. [Expo BackgroundTask](https://docs.expo.dev/versions/latest/sdk/background-task/).
- Cihaz testi: izin ret/geri alma, reboot, force-stop, ekran kilidi, pil tasarrufu, ses/kanal değişimi, timezone/saat değişimi. Gerçek capability okunamıyorsa “bilinmiyor” göster; skor uydurma.
