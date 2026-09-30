# Vakit

Türkiye için Türkçe, hesapsız ve reklamsız iOS/Android namaz vakti uygulaması. İlk dikey dilim hazır: konum → cihazda hesaplama → sıradaki vakit → sayaç → tek Home ve merkezi tema.

Expo SDK 57 · React Native 0.86 · React 19.2 · TypeScript strict · Expo Router. Saatler Adhan Türkiye yöntemiyle hesaplanır; **resmî Diyanet verisi değildir**.

## Çalıştırma

Node 24 LTS kullanın (`.nvmrc`). Repository kökünde:

```sh
npm ci
npm start
```

Web inceleme: `npm run web`. Android emülatörde Expo Go için `npm start -- --lan`. Native prebuild/APK bu aşamada kullanılmıyor. Bu Windows ortamında Node 24 ayrıca `%LOCALAPPDATA%/vakit-toolchain/node-v24.21.0-win-x64` altında bulunur; global Node değiştirilmedi.

```sh
npm run check          # strict tip kontrolü, lint, 34 test
npm run test:timezones # İstanbul / UTC / New York
npx expo-doctor
npm run export        # Android/iOS/web bundle; native build değildir
```

Konum ve tercihler cihazda kalır. İlk açılışta varsayılan şehir atanmaz. Manuel seçim internet istemez; GPS izni isteğe bağlıdır. Native kalıcılık SQLite KV, web önizlemede localStorage kullanır. Fontlar, konum kataloğu ve takvim verisi paketlidir.

## Durum

Home, konum seçici ve temel görünüm tercihleri çalışıyor. Bildirimler, kapsamlı ayarlar, aylık takvim, kıble ve mağaza hazırlığı sonraki aşamalardır. Gerçek iOS/Android cihaz testi yapılmadı; üretim sürümü hazır kabul edilmez.

- [Devam planı](docs/PLAN.md)
- [Mimari ve bildirim planı](docs/ARCHITECTURE.md)
- [Stitch tasarım eşlemesi](docs/DESIGN.md)
- [Veri kaynakları ve lisanslar](docs/DATA-SOURCES.md)
- [Doğrulama ve bilinen sınırlar](docs/VALIDATION.md)

`vakit-app ekranlar/` ve `ek-ekranlar/` korunan referanslardır. Stitch yalnız geliştirme aracıdır; uygulama WebView veya Stitch API anahtarı içermez.
