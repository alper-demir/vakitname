# Veri kaynakları

İnceleme/indirme: 30 Eylül 2026. Uygulamanın bu adreslere runtime isteği yok.

| Veri | Kaynak ve koşul | Kullanım |
|---|---|---|
| Yerleşimler | [GeoNames Türkiye](https://download.geonames.org/export/dump/TR.zip), [format/lisans](https://download.geonames.org/export/dump/readme.txt), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | 81 il, 974 ADM2 kaydı. İsimler sadeleştirildi, merkezler eşleştirildi. 29 kayıt yaklaşık temsil koordinatı kullanır ve UI'da belirtilir. Güncel resmî ilçe sicili değildir; tamlık denetimi açık. |
| Ülke sınırı | [Natural Earth 1:10m](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_admin_0_countries.geojson), [public domain](https://www.naturalearthdata.com/about/terms-of-use/) | Türkiye MultiPolygon ayrıldı. Offline GPS kapsam kontrolü; sınır/kıyı hassasiyeti kadastro doğruluğunda değildir. |
| Vakit | [Adhan JS](https://github.com/batoulapps/adhan-js), MIT, 4.4.6 | Turkey preset; kullanıcı düzeltmeleri ayrı. Resmî Diyanet tablosu değildir. |
| Hicri ay başlangıçları | [Diyanet 2026](https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=153), [2027](https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=154) | Yalnız olgusal tarihler elle kaydedildi; sayfa/logo/metin kopyalanmadı. 2025-12-21 dahil, 2027-12-29 hariç kapsam. Resmî ortaklık iddiası yok. |
| Kapsam dışı Hicri tarih | Cihaz Intl islamic-umalqura | Diyanet ile eşit varsayılmaz; kaynak modalında ayrı gösterilir. Destek yoksa kullanılamıyor durumu. Hermes cihaz testi açık. |
| Font | [Manrope](https://github.com/sharanda/manrope), SIL OFL 1.1 | Yerel fontlar; assets/licenses/Manrope-OFL.txt. |

GeoNames atfı uygulamanın kaynak modalında bulunur. Türetilmiş katalog CC BY 4.0 kaynak atfı ve değişiklik bildirimiyle dağıtılır; veri garantisi verilmez. Adhan lisansı assets/licenses/Adhan-MIT.txt içinde.

## Yeniden üretim

`scripts/import-geodata.mjs <kaynak-dizini>` girdileri TR.txt ve countries.geojson. Çıktılar src/data altındadır. GeoNames il kodu plaka kodu değildir. Ham veri SHA256 ve indirme tarihi geodata-metadata.json içinde. Yeni indirmede kayıt farklarını/temsil noktalarını gözden geçir ve metadata tarihini güncelle.

GPS koordinatı hesaplamada aynen korunur; en yakın ilçe yalnız yaklaşık etiket sağlar. Manuel il seçimi il merkezi, ilçe seçimi ilgili kayıt koordinatıdır. Stitch örnek saatleri hesaplamaya girmez.
