# Vakit — çalışma kuralları

## Her oturumda izlenecek protokol

- Çalışmaya başlamadan önce bu dosyayı ve ardından `docs/PLAN.md` dosyasını oku. `docs/PLAN.md` mevcut durum, tamamlanan işler, açık kontroller ve sıradaki iş için tek devam kaynağıdır.
- Yalnız yapılacak işle ilgili ek belgeyi aç: UI/Stitch için `docs/DESIGN.md`, teknik veya paket kararı için `docs/ARCHITECTURE.md`, test ve cihaz kanıtları için `docs/VALIDATION.md`, veri/lisans için `docs/DATA-SOURCES.md`. Tüm ekranları, bütün belgeleri veya sohbet geçmişini baştan tarama.
- Belgedeki bilgiyle çalışma ağacı çelişirse önce dosya ve testlerle gerçek durumu doğrula; belgeyi sessizce varsayma. Bulduğun farkı ilgili belgeye düzeltme olarak işle.
- Yeni bir mimari karar veya bağımlılık değişikliği `docs/ARCHITECTURE.md` içine; Stitch eşlemesi veya görsel karar `docs/DESIGN.md` içine; test/cihaz sonucu ve bilinen risk `docs/VALIDATION.md` içine yazılır. Kaynak veya lisans değişikliği `docs/DATA-SOURCES.md` içine yazılır.
- Her çalışma oturumunun sonunda `docs/PLAN.md` içindeki tamamlananlar, açık işler, sıradaki somut adım ve `Oturum devri` bölümünü güncelle. Yapılmayan işi tamamlandı sayma; geçici süreçleri (Metro/emülatör gibi) sonraki oturumda çalışıyor varsayma.
- Kullanıcıya durum bildirirken bu belgelerdeki doğrulanmış bilgiyi esas al. Kod, test veya cihaz üzerinde doğrulanmayan davranışı kesin sonuç gibi yazma.

## Ürün ve geliştirme kuralları

- Kullanıcı Türkçe iletişim, kısa güncellemeler ve az bağımlılık istiyor. Rutin mühendislik kararlarını kendin ver. Alt ajanları ancak kullanıcı açıkça isterse kullan.
- Kullanıcı “kota yenilendi devam et” diyerek geliştirmeyi onayladı. İlk dikey dilim kuruldu; güncel durum `docs/PLAN.md` içinde.
- Android incelemesi şimdilik yalnız Expo Go + Metro ile yapılır. Kullanıcı açıkça istemeden `expo run:android`, prebuild, APK/AAB veya native `android/` klasörü üretme.
- Proje repository köküne kurulacak; ikinci `vakit-app/` dizini oluşturma. Mevcut dosyaları scaffold sırasında koru.
- `vakit-app ekranlar/` ve `ek-ekranlar/` salt okunur tasarım referanslarıdır; silme, taşıma, yeniden adlandırma veya değiştirme. Stitch projesini de açık talep olmadan değiştirme.
- Stitch HTML/CSS yalnızca referans: native React Native componentleri kullan; WebView veya HTML kopyası üretme.
- Tek Home ve merkezi tema sistemi kullan. Mevsim/gün fazı/Ramazan varyasyonlarını ayrı route veya kopya component ağacı yapma.
- İlk teslim yalnızca çalışan dikey dilim: konum → cihazda hesaplama → sıradaki vakit → sayaç → tema → Home. Sonraki ekranlara Home değerlendirmesinden sonra geç.
- Türkiye öncelikli, Türkçe, hesapsız, reklamsız ve backend gerektirmeyen offline uygulama. Kısa yerel bildirim sesleri yeterli.
- Vakit/saat dilimi/takvim kurallarını UI'dan ayır. Örnek Stitch saatlerini, tarihlerini, hassasiyet ve bildirim durumu değerlerini production verisi yapma.
- Resmî veri kullanılmadan “Diyanet vakitleri” veya “tam uyum” iddiası yazma. Hesaplama yöntemi, kaynak ve kullanıcı düzeltmesi açık olmalı.
- Strict TypeScript; SDK ile uyumlu kararlı sürümler; `expo install` ve lockfile. Gereksiz state/UI/backend paketi ekleme.
- Anlamlı domain ve kullanıcı akışı testleri yaz. Cihazda doğrulanmayan bildirim/GPS/sensör davranışını doğrulanmış gibi sunma.
- Kaynak güncelliğini yalnızca ilgili karar değiştiğinde/kurulumda kontrol et. Doğrulanan sürüm ve kaynakları `docs/ARCHITECTURE.md` içinde güncelle.
- API anahtarları repository'ye, belgelere, uygulama bundle'ına veya loglara girmez. Stitch yalnızca geliştirme aracıdır; runtime bağımlılığı değildir.
- Yerel Git sürümlemesi kullanıcı tarafından onaylandı. Anlamlı ve doğrulanmış kilometre taşlarında küçük, tutarlı Conventional Commit'ler oluştur; sürüm politikasını `docs/VERSIONING.md` dosyasından izle. `main` yalnız doğrulanmış sürümleri, `develop` devam eden entegrasyonu, `feature/*` ve `fix/*` izole işleri taşır. Her küçük düzenleme için branch veya commit üretme.
- Commit öncesi ilgili kontrolleri çalıştır ve `docs/PLAN.md` devam noktasını güncelle. Hassas veri, `.env`, build çıktısı, `node_modules`, `android/`, `ios/` veya geçici artifact commit etme. Geçmişi yeniden yazma, tag silme, force push yapma. Remote ekleme ve push işlemleri kullanıcı açıkça istemeden yapılmaz.
