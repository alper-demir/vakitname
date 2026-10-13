# Veri kaynakları

İnceleme/indirme: 1 Ekim 2026. Uygulamanın bu adreslere runtime isteği yok.

| Veri | Kaynak ve koşul | Kullanım |
|---|---|---|
| Yerleşimler | [GeoNames Türkiye](https://download.geonames.org/export/dump/TR.zip), [format/lisans](https://download.geonames.org/export/dump/readme.txt), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | 81 il, 974 ADM2 kaydı. İsimler sadeleştirildi, merkezler eşleştirildi. 29 kayıt yaklaşık temsil koordinatı kullanır ve UI'da belirtilir. Güncel resmî ilçe sicili değildir; tamlık denetimi açık. |
| Ülke sınırı | [Natural Earth 1:10m](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_admin_0_countries.geojson), [public domain](https://www.naturalearthdata.com/about/terms-of-use/) | Türkiye MultiPolygon ayrıldı. Offline GPS kapsam kontrolü; sınır/kıyı hassasiyeti kadastro doğruluğunda değildir. |
| Vakit | [Adhan JS](https://github.com/batoulapps/adhan-js), MIT, 4.4.6; doğrulama için [Diyanet Namaz Vakitleri](https://namazvakitleri.diyanet.gov.tr/) | Turkey preset; kullanıcı düzeltmeleri ayrı. Uygulama vakitleri cihazda hesaplar, Diyanet tablosunu runtime'da indirmez ve resmî Diyanet verisi olduğunu iddia etmez. `npm run verify:prayer-times` canlı resmî tablolarla mühendislik karşılaştırması yapar. |
| Hicri ay başlangıçları | [Diyanet 2026](https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=153), [2027](https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=154), [2028](https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=185), [2029](https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=186) | Yalnız olgusal tarihler elle kaydedildi; sayfa/logo/metin kopyalanmadı. 2025-12-21 dahil, 2029-01-16 hariç kapsam; böylece 2026–2028 tamamı resmî ay sınırlarıyla kapsanır. Son tarih yalnız bir sonraki ay için sentinel'dir. Resmî ortaklık iddiası yok. |
| Kapsam dışı Hicri tarih | Cihaz Intl islamic-umalqura | Diyanet ile eşit varsayılmaz; kaynak modalında ayrı gösterilir. Destek yoksa kullanılamıyor durumu. Hermes cihaz testi açık. |
| Kıble referans noktası | [OpenStreetMap Kâbe noktası](https://www.openstreetmap.org/?mlat=21.422487&mlon=39.826206#map=18/21.422487/39.826206), ODbL | WGS84 21.422487, 39.826206; yalnız cihazdaki büyük çember yön/mesafe hesabında sabit referans. Harita veya runtime isteği kullanılmaz. |
| Font | [Manrope](https://github.com/sharanda/manrope), SIL OFL 1.1 | Yerel fontlar; assets/licenses/Manrope-OFL.txt. |
| Bildirim sesi | Proje içinde 1 Ekim 2026'da matematiksel sinüs dalgalarından özgün üretildi; üçüncü taraf kayıt içermez | `assets/sounds/vakit_tone.wav`, 1,15 saniye mono PCM. Tam ezan veya müzik kaydı değildir. |
| Uygulama ikonu | Kullanıcının sağladığı ChatGPT üretimi `Minimalist Hilal Pusula Uygulama İkonu.png`; proje içinde Android için beyaz köşe temizliği ve adaptive foreground türetildi | `assets/icon/vakit-icon.png` ve `vakit-icon-foreground.png`. Üçüncü taraf marka veya görsel kullanılmadı; mağaza kullanımı için üretim hakkı kullanıcı tarafından doğrulanmalıdır. |
| Splash ayet metni | [Diyanet İşleri Başkanlığı — İsrâ Suresi 78. ayet, Kur'an Yolu meali](https://kuran.diyanet.gov.tr/tefsir/%C4%B0sr%C3%A2-suresi/2107/78-ayet-tefsiri), doğrulama: 3 Ekim 2026 | Splash ekranında ayet numarasıyla birlikte kısa Türkçe meal gösterilir. Stitch referansındaki “güneşin batışından” ifadesi birebir ayet metni olmadığı için kullanılmaz; resmî metindeki “güneşin gün ortasını aşmasından” ifadesi kullanılır. |

GeoNames atfı uygulamanın kaynak modalında bulunur. Türetilmiş katalog CC BY 4.0 kaynak atfı ve değişiklik bildirimiyle dağıtılır; veri garantisi verilmez. Adhan lisansı assets/licenses/Adhan-MIT.txt içinde.

## Yeniden üretim

`scripts/import-geodata.mjs <kaynak-dizini>` girdileri TR.txt ve countries.geojson. Çıktılar src/data altındadır. GeoNames il kodu plaka kodu değildir. Ham veri SHA256 ve indirme tarihi geodata-metadata.json içinde. Yeni indirmede kayıt farklarını/temsil noktalarını gözden geçir ve metadata tarihini güncelle.

GPS koordinatı hesaplamada aynen korunur; en yakın ilçe yalnız yaklaşık etiket sağlar. Manuel il seçimi il merkezi, ilçe seçimi ilgili kayıt koordinatıdır. Stitch örnek saatleri hesaplamaya girmez.

## Yeni yıl Hicrî veri güncellemesi

Namaz vakitleri için 2029, 2030 veya sonraki yıllarda veri eklemek gerekmez; Adhan aynı hesaplama yöntemiyle cihazda üretmeye devam eder. Resmî Türkiye Hicrî görünümünü uzatmak için Diyanet'in ilgili yıllık sayfası yayımlandığında yalnız ay başlangıçlarını `src/data/hijri-months.ts` içine sırayla ekle; son kapsanan ayın ardından gelen ayın ilk gününü sınır olarak ekle. Ardından bu kaynak satırına yılı/URL'yi ekle, `tests/calendar-table.test.ts` içinde ilgili Ramazan sınırını doğrula, Home ve Hicrî ayarlarındaki yıl kapsam metnini güncelle; `npm run check` çalıştır. Sayfa metni, logo veya tablo görseli paketlenmez ve uygulama çalışma zamanında Diyanet'e bağlanmaz.
