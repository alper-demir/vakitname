# Tasarım kararları

İnceleme: 30 Eylül 2026. İlk 30 ve ek 7 yerel ekranın PNG/HTML içerikleri incelendi; Stitch MCP 37 ekran listeliyor. İki `vakit/DESIGN.md` dosyası SHA-256 bakımından aynı. Klasör adları export'taki haliyle korunur.

## Ana referans ve ortak dil

Home yerleşimi: `vakit-app ekranlar/bug_n_i_lkbahar_g_nd_z_2/screen.png`. Büyük dairesel sayaç, konum/tarih, tek yüzeyde altı vakit ve sakin alt navigasyon. `_3` varyasyonunun metin kontrastından yararlanılacak; tüm layout kopyalanmayacak.

Manrope; adaçayı/krem gündüz, lacivert/altın gece; 20–24 px yatay boşluk, 24–28 px kart köşeleri, ince çizgiler, ölçülü transparan yüzeyler. Kaynak: `vakit-app ekranlar/vakit/DESIGN.md`. Küçük ekranda sayaç taşmayacak; büyük yazıda dikey kaydırma olacak. Dokunma alanları en az 44 pt/48 dp hedefler. Geçmiş vakitlerin soluklaştırılması okunabilirliği bozmayacak. Hareket azaltma tercihine uyulacak.

## Home varyasyonlarının eşlemesi

Önekler aşağıda `vakit-app ekranlar/` altındaki gerçek dizin adlarıdır. İlk 19 Home çıktısı aynı ekran ailesi; ek Yatsı sonrası çıktı bir durum varyasyonudur. Birebir dosya kopyası yerine işlevsel tekrarlar bulunuyor.

| Dizin / grup | Adet | Kullanım |
|---|---:|---|
| `bug_n_i_lkbahar_g_nd_z_1/2/3` | 3 | `_2` ana düzen; `_3` kontrast; `_1` yoğun içerik alternatifi |
| `bugün_ilkbahar_afak_1/2` | 2 | Aynı şafak düzeninin yüzey/vurgu revizyonu; `_2` referans |
| `bug_n_i_lkbahar_gece_1/2` | 2 | `_2` bütün ekranı kapsayan gece paleti |
| `bug_n_yaz_g_nd_z_1/2` | 2 | `_2` gökyüzü/sıcak renk referansı, doygunluk ölçülü tutulacak |
| `bug_n_yaz_gece_1/2` | 2 | `_2` okunaklı koyu referans; `_1` beyaz zemin/metin hatalı |
| `bug_n_sonbahar_g_nd_z`, `bug_n_sonbahar_g_n_bat_m` | 2 | Gündüz ve gün batımı renk/illüstrasyonları |
| `bug_n_k_g_nd_z`, `bug_n_k_gece_1/2/3` | 4 | Gündüz + gece `_3`; gece `_1` kontrast hatalı, `_2` ara revizyon |
| `ramazan_özel_ana_ekran`, `ramazan_özel_gece_sade` | 2 | Sade varyasyonun iftar/sahur kartları; ayrı Home route değil |

Her mevsimin dört fazı için ayrı tasarım mevcut değil. Eksik kombinasyonlar ortak tokenlardan türetilecek; yeni Stitch export'u geliştirme önkoşulu değil. Başlık/alt menü de tema ile birlikte değişecek; açık başlık + koyu içerik hatası taşınmayacak.

## Gerçek ekranlar

Üç onboarding adımı; şehir/ilçe seçimi; Home; takvim; genel ayarlar; bildirim ayarları; ses seçim modali; tema seçici; hesaplama/düzeltmeler; Hicri ayar; bildirim yardım ekranı; Kıble. Aylık takvim ve Ramazan imsakiyesi ortak takvim modelinin iki görünümü. `vakit_logo` ekran değildir; SVG marka referansıdır.

Faz 2'de onboarding üç adım olarak tek component içinde, ayarlar ise genel merkez + hesaplama + Hicri route'ları olarak native componentlerle uygulandı. Bildirim onboarding adımı yalnız yaklaşan özelliği açıklar ve erken sistem izni istemez.

Faz 3'te `bildirim_ayarlar` ana görsel referans alındı; tek açılır kart yerine daha sakin global tercihler + altı vakit anahtarı kullanıldı. `ses_seçimi` içindeki kaynağı olmayan ezan/melodi adları taşınmadı; özgün kısa Vakit tonu, sistem sesi ve sessiz seçenekleri sunuldu. `bildirim_durumu_ve_yard_m` düzeni kullanıldı; yanlış “Şehir Seçimi”, uydurma güvenilirlik skoru ve cihazda ölçülmeyen kesin alarm/pil muafiyeti durumları kaldırıldı.

Faz 4'te `ayl_k_takvim_ve_i_msakiye` ve `ramazan_i_msakiyesi` ana referans alındı. Ortak native Takvim ekranında Aylık görünüm ve Ramazan görünümü segmented seçimle ayrılır; seçili gün üst kartta, tüm saatler yatay kaydırılabilir tabloda gösterilir. Stitch’teki PDF/paylaşım, “tam Diyanet uyumu” ve örnek saatler kullanılmadı; yerel hesaplama ve kaynak açıklaması korundu.

## Ek ekranlar ve uygulamaya alınacak düzeltmeler

Aşağıdaki dizinler repository kökündeki `ek-ekranlar/` altındadır. Stitch screen ID'leri yeniden arama ihtiyacını azaltır; proje ID'si `2377776243904543808`.

| Yerel dizin | Stitch screen ID | Karar |
|---|---|---|
| `konum_i_zni_ve_durumu` | `2c87db6f316c452e8550006796797209` | İzin reddi, GPS kapalı, timeout ayrı durumlar. Ayarlara git yalnız gerektiğinde. Manuel seçim her zaman erişilebilir. |
| `i_l_e_se_imi_ve_onay` | `241e3815e33e49458831de69a3311772` | Seçim taslağı onaylanınca kaydedilir. Boş sonuç, listeyle aynı anda gösterilmez. |
| `bug_n_yats_sonras_yar_n_i_msak` | `61b1337c79c04c888c3e1fd97b01b5dd` | Tek Home'un gece durumu; hedef tarihi açık. Gece yarısından sonra “Bugün İmsak”. |
| `hesaplama_ve_vakit_d_zeltmeleri` | `3860c72662414b83ae051f84ec7aab9a` | Yöntem adı ve parametreleri gerçek sağlayıcıdan; her vakte ayrı düzeltme. |
| `hicri_takvim_ayar` | `9b1cd4916e3046468e08ccd19bc93b5e` | ±2 gün önizleme; takvim kaynağı açıklanır. Görünüm tercihi takvimi değiştirmez. |
| `bildirim_durumu_ve_yard_m` | `4a570d0b06e94170837e0a75d058f680` | Gerçek platform yetenekleri ve planlama bitiş tarihi; uydurma skor yok. |
| `k_ble_pusulas` | `b7877cc7aaf548e7a915141842478907` | Kıble route'u uygulandı. Doğru kuzey/manyetik kuzey ayrımı ve sensörsüz durum korunuyor. |

Ortak düzeltmeler:

- Ek ayar ekranlarındaki yanlış “Şehir Seçimi” başlığı ve bütün profil ikonları kaldırılacak.
- “Diyanet uyumlu”, “uluslararası hilal kriterleri entegre”, “±1° hassas”, “%65 güvenilirlik” gibi ölçülmemiş iddialar kullanılmayacak.
- Bildirim testi “planlandı” diyebilir; teslim/duyulma doğrulanmadan “3 saniye içinde titreyecek” demeyecek. DND/sessiz modu aşma vaadi yok.
- Gece ekranındaki “6/6 tamamlandı” ibadet takibi gibi sunulmayacak: “Bugünün son vakti girdi”. Sabit “03:30 sahur önerisi” kaldırılacak.
- İmsak vakti ile sabah ezanının okunma zamanı ayrı kavramlardır; İmsak bildiriminde “İmsak vakti” denecek. Güneş ezan olayı değildir.
- Kıble ekranında “hizalandı” ve “kalibrasyon gerekli” aynı anda kesin durum olarak gösterilmeyecek; 152°/mesafe örnekleri hesaplanacak.
- Yöntem değişimi GPS koordinatlarını zorunlu olarak ayar ekranının tepesinde göstermeyecek. Türkiye için başlangıçta tek doğrulanmış hesaplama profili yeterli.
- Ana Home'da Kur'an/dua içerikleri ilk dilimin parçası değil. Sonradan eklenirse metin kaynağı ve çeviri kullanım koşulları kaydedilecek.

## Kalan tasarım boşlukları

Home skeleton/ilk hesaplama; kayıtlı konumla yenileme hatası; Play Store önizleme ve adaptive maskenin gerçek cihaz davranışı henüz tasarım doğrulamasından geçmedi. Hakkında/gizlilik/lisans içeriği native `/about` ekranında mevcut component diliyle uygulandı. İşletim sistemi izin pencereleri özel ekran olarak taklit edilmeyecek. Türkiye dışı GPS için Türkiye'den manuel konum seçme durumu gerekli.

## Faz 6 yayın yüzeyi

Stitch'teki sade marka dilini korumak için splash koyu yeşil zemin, kullanıcı tarafından sağlanan hilal-pusula ikonu ve kısa sloganla iki aşamalı çözüldü. Hakkında ekranı ayarlar içinden erişilir; gizlilik, veri saklama, kaynak ve lisans bilgilerini kartlar halinde açıklar. Büyük metinler, başlık rolleri, düğme etiketleri ve dış bağlantıların erişilebilir adları native bileşenlerle sağlandı.

## Faz 5 Kıble eşlemesi

`k_ble_pusulas` ekranı tek native Kıble route'una dönüştürüldü. Büyük dairesel pusula, K/D/G/B işaretleri, açı/mesafe kartı ve yardım yüzeyi Stitch hiyerarşisini referans alır. Görseldeki İstanbul 152° ve yaklaşık 2.415 km değerleri taşınmadı: seçili konumdan hesaplanır. Görselde aynı anda yer alan “hizalandı” ve “kalibrasyon gerekli” ifadeleri durum makinesine ayrıldı. Sensörsüz durumda gerçek kuzeye göre statik açı görünür; manyetik veri tek başına hizalama iddiası üretmez. Alt navigasyon, Stitch'teki Bugün/Takvim/Kıble/Ayarlar yapısına uyar; konum seçimi Home üstündeki konum alanı ve Ayarlar'da korunur.

## Asset politikası

Yerel export'larda PNG/HTML/Markdown var; font ve ses dosyaları yok. HTML'deki Google Fonts, Tailwind, Material Symbols ve Google görsel URL'leri runtime bağımlılığı olmayacak. Gerekli lisanslı Manrope dosyaları paketlenecek; halkalar/ikonlar/atmosfer native SVG/gradient ile yapılacak. Logo HTML dosyası SVG içeriyor; üretim ikonu ayrı asset olarak hazırlanacak. Bildirim sesi için lisansı belli kısa bir ton seçilecek; tasarımdaki “Diyanet İstanbul Ezanı” isimleri mevcut ses dosyası anlamına gelmiyor.
