# Git ve sürümleme

## Branch düzeni

- `main`: doğrulanmış, geri dönülebilir kilometre taşları. Her uygulama sürümü SemVer etiketi alır.
- `develop`: sıradaki sürümün entegrasyon branch'i ve günlük geliştirme başlangıç noktası.
- `feature/<kısa-ad>`: birden fazla dosya veya oturum sürecek bağımsız özellikler.
- `fix/<kısa-ad>`: doğrulanmış bir hatanın izole düzeltmesi.

Küçük ve tek oturumluk düzenlemeler doğrudan `develop` üzerinde yapılabilir. `feature/*` ve `fix/*` kontroller geçtikten sonra `develop` ile birleştirilir. `main`, doğrulanmış bir kilometre taşı hazır olduğunda `develop` üzerinden ilerletilir.

## Commit ve etiketler

Commit mesajları Conventional Commits biçimindedir: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`. Her commit tek bir anlaşılır amacı kapsar ve mümkün olduğunda çalışan durumda bırakılır.

Sürümler SemVer kullanır:

- `v0.x.y`: ürün geliştirme aşaması.
- `y`: geriye uyumlu düzeltme veya küçük iyileştirme.
- `x`: yeni doğrulanmış özellik grubu.
- `v1.0.0`: mağaza/release ölçütleri tamamlandığında.

İlk geri dönüş noktası `v0.1.0`: konum → cihazda vakit hesabı → sıradaki vakit → sayaç → merkezi tema → gerçek Home dikey dilimi.

`v0.2.0`: üç adımlı onboarding, genel ayarlar merkezi, vakit bazlı dakika düzeltmeleri ve Hicri gün düzeltmesi.

`v0.3.0-rc.1`: Expo Go kabulü yapılmış yerel aday. Bildirimler, Takvim/Ramazan, Kıble, yayın yüzeyi, GPS sağlamlaştırması ve 15 günlük bildirim planı dahildir. Bu etiket mağaza yayını değildir; özgün ses/sessiz kanal ile güç yönetimi kontrolleri tamamlanınca nihai `v0.3.0` etiketlenir.

## Güvenli çalışma

Commit öncesi ilgili testler ve typecheck/lint çalıştırılır; doğrulama sonucu `docs/VALIDATION.md`, devam noktası `docs/PLAN.md` içinde tutulur. Tag'ler silinmez veya başka commit'e taşınmaz. Paylaşılan geçmişte rebase/force push yapılmaz. Remote ve push ayrı kullanıcı talebiyle yapılandırılır.
