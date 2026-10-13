# Google Play Console kaydı

Bu belge, **Vakitname** uygulamasının Google Play Console'da doldurulan mağaza, içerik ve uyumluluk cevaplarının tarihli çalışma kaydıdır. Play Console'da her değişiklikten sonra bu belge ve gerekiyorsa `docs/PLAY-STORE-COMPLIANCE.md`, `docs/PRIVACY-POLICY.md` ve `privacy-site/index.html` birlikte güncellenir.

## Kayıt bilgisi

- Son kontrol/güncelleme: **13 Ekim 2026**
- Geliştirici görünen adı: **alemdem**
- Destek e-postası: **support.alemdem@gmail.com**
- Uygulama adı: **Vakitname**
- Android package: `com.alemdem.vakitname` (değiştirilmez)
- Hedef platform: Android / Google Play
- Play Console uygulama kaydı: kullanıcı tarafından oluşturuldu
- Gizlilik politikası: <https://vakit-privacy.netlify.app/>
- İlk `versionCode`: `1`

## Uygulama oluşturma ayarları

- Varsayılan dil: Türkçe
- Uygulama türü: Uygulama
- Ücretlendirme: Ücretsiz
- Reklam içeriyor mu?: Hayır (mevcut sürüm)
- Uygulamaya erişim için hesap gerekir mi?: Hayır
- Mağaza kategorisi: Yaşam Tarzı (önerilen/seçilecek)
- Geliştirici iletişim adresi: `support.alemdem@gmail.com`

## İçerik derecelendirmesi — 13 Ekim 2026

- Kategori: Diğer Tüm Uygulama Türleri
- İndirilen yaş kısıtlı içerik: Hayır
- Kullanıcı içeriği paylaşımı: Hayır
- Online içerik: Hayır
- Sigara/alkol/ateşli silah/kumar: Hayır
- Fiziksel konumun diğer kullanıcılarla paylaşımı: Hayır
- Dijital ürün satın alma: Hayır (premium/IAP henüz yok)
- Nakit/kripto/NFT ödülü: Hayır
- Web tarayıcısı veya arama motoru: Hayır
- Haber veya eğitim ürünü: Hayır
- Sonuç: tüm bölgelerde genel izleyici; Avrupa PEGI 3, IARC/Google Play 3+, ESRB Everyone ve eşdeğerleri

İleride reklam, IAP veya kullanıcı içeriği eklenirse bu anket yeniden doldurulur.

## Hedef kitle ve içerik — 13 Ekim 2026

- Hedef yaş grupları: 13–15, 16–17, 18 yaş ve üstü
- 5 yaş ve altı, 6–8, 9–12: seçilmedi
- Çocuklara özel tasarım/hedefleme: Hayır

## Reklam — 13 Ekim 2026

- Uygulama reklam içeriyor mu?: Hayır
- Reklam kimliği (`AD_ID`) kullanıyor mu?: Hayır
- Reklam SDK'sı: yok

İleride reklam eklenirse yeni SDK/native AAB gerekir; bu beyan, gizlilik politikası ve Veri Güvenliği formu güncellenir.

## Veri güvenliği — 13 Ekim 2026

### Genel cevaplar

- Kullanıcı verilerinden herhangi biri toplanıyor/paylaşılıyor mu?: Evet
- Aktarım sırasında şifreleme: Evet
- Kullanıcıların hesap oluşturmasına izin veriliyor mu?: Hayır
- Dışarıda oluşturulmuş hesapla giriş: Hayır
- Hesap/veri silme talep yöntemi: Hayır (hesap sistemi yok; yerel veri Android ayarlarından temizlenebilir)
- Yaklaşık konum veya tam konum: seçilmedi; konum yalnız cihazda işlenir

### Bildirilen veri türleri

EAS Update teknik hizmet akışı nedeniyle aşağıdaki türler **toplandı**, **paylaşılmadı** olarak kaydedilir:

- Teşhisler
- Uygulama performansıyla ilgili diğer veriler
- Cihaz veya diğer kimlikler

Bu üç tür için:

- Kısa süreli işleme: Hayır
- Toplama: Zorunlu
- Kullanım amacı: yalnızca Uygulama işlevselliği
- Analiz, reklam/pazarlama, kişiselleştirme, geliştirici iletişimi, sahtekârlığı önleme, hesap yönetimi: seçilmez

Konum, kişisel bilgiler, finans, sağlık, kişiler, takvim, fotoğraf/video, ses, mesajlar, web tarama ve uygulama etkinliği veri türleri seçilmez.

> Not: EAS Update Expo hizmet sağlayıcısı olarak teknik verileri işleyebilir. Google Play'in hizmet sağlayıcı istisnası nedeniyle bu kayıt “paylaşıldı” olarak işaretlenmez; teknik akış gizlilik politikasında açıklanır.

## Mağaza girişi — hazırlanan değerler

- Mağaza adı: **Vakitname**
- Kısa açıklama: `Namaz vakitleri, kıble ve Ramazan takvimi; reklamsız ve cihazında.`
- Gizlilik politikası URL'si: `https://vakit-privacy.netlify.app/`
- Tam açıklama: `docs/PLAY-STORE-COMPLIANCE.md` içindeki “Mağaza açıklaması taslağı” temel alınacak.
- İkon, feature graphic ve telefon ekran görüntüleri: açık
- Etiketler: Play Console'un sunduğu listeden namaz/prayer, kıble/qibla, Ramazan/Ramadan, takvim/calendar ve hatırlatıcı/bildirim karşılıkları varsa seçilecek; desteklenmeyen etiketler seçilmeyecek.

## Değişmez/özel dikkat gerektiren değerler

- `com.alemdem.vakitname` package adı değiştirilemez; değişiklik yeni Play uygulaması olur.
- Cihazdaki uygulama adı: **Vakitname**.
- Mağaza adı daha sonra değiştirilebilir; package ve cihaz adı bundan bağımsızdır.
- Reklam, IAP, analiz, hesap, backend, push sunucusu veya yeni SDK eklenirse bu belge, Veri Güvenliği, gizlilik politikası, mağaza açıklaması ve gerekiyorsa hedef kitle beyanı birlikte yeniden incelenir.
- İlk AAB henüz yüklenmedi; native release doğrulaması ve kapalı test açık.

## Değişiklik günlüğü

- **13 Ekim 2026:** Play Console uygulama kaydı oluşturuldu; Vakitname/package/developer adı doğrulandı. Reklam, içerik derecelendirmesi ve hedef kitle cevapları tamamlandı. Veri Güvenliği formu EAS Update teknik veri akışına göre dolduruluyor. Varsayılan mağaza girişi henüz tamamlanmadı.
