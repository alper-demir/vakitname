from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Vakit-Gizlilik-Politikasi.pdf"
FONT_DIR = ROOT / "node_modules" / "@expo-google-fonts" / "manrope"

INK = colors.HexColor("#151D1A")
MUTED = colors.HexColor("#536159")
PRIMARY = colors.HexColor("#315E45")
DEEP = colors.HexColor("#08201D")
SURFACE = colors.HexColor("#F3FBF5")
SOFT = colors.HexColor("#E7F0EA")
LINE = colors.HexColor("#C8D8CD")
GOLD = colors.HexColor("#B78B16")
GOLD_SOFT = colors.HexColor("#FFF3C4")


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Manrope", str(FONT_DIR / "400Regular" / "Manrope_400Regular.ttf")))
    pdfmetrics.registerFont(TTFont("Manrope-Medium", str(FONT_DIR / "500Medium" / "Manrope_500Medium.ttf")))
    pdfmetrics.registerFont(TTFont("Manrope-SemiBold", str(FONT_DIR / "600SemiBold" / "Manrope_600SemiBold.ttf")))
    pdfmetrics.registerFont(TTFont("Manrope-Bold", str(FONT_DIR / "700Bold" / "Manrope_700Bold.ttf")))


class PolicyDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str):
        super().__init__(
            filename,
            pagesize=A4,
            leftMargin=22 * mm,
            rightMargin=22 * mm,
            topMargin=24 * mm,
            bottomMargin=21 * mm,
            title="Vakit Gizlilik Politikası",
            author="Vakit uygulaması geliştiricisi",
            subject="Vakit Android uygulaması gizlilik ve veri kullanımı açıklaması",
        )
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="content")
        self.addPageTemplates(PageTemplate(id="policy", frames=[frame], onPage=draw_page))


def draw_page(canvas, doc) -> None:
    canvas.saveState()
    width, height = A4
    if doc.page == 1:
        canvas.setFillColor(DEEP)
        canvas.rect(0, height - 95 * mm, width, 95 * mm, stroke=0, fill=1)
        canvas.setFillColor(colors.HexColor("#F1D37A"))
        canvas.circle(width - 29 * mm, height - 19 * mm, 4.2 * mm, stroke=0, fill=1)
        canvas.setStrokeColor(colors.Color(1, 1, 1, alpha=.18))
        canvas.setLineWidth(.8)
        canvas.circle(width - 29 * mm, height - 19 * mm, 16 * mm, stroke=1, fill=0)
    else:
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(.45)
        canvas.line(doc.leftMargin, height - 16 * mm, width - doc.rightMargin, height - 16 * mm)
        canvas.setFont("Manrope-SemiBold", 8)
        canvas.setFillColor(PRIMARY)
        canvas.drawString(doc.leftMargin, height - 12.5 * mm, "VAKİT  /  GİZLİLİK POLİTİKASI")

    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(.45)
    canvas.line(doc.leftMargin, 14 * mm, width - doc.rightMargin, 14 * mm)
    canvas.setFont("Manrope", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 9.5 * mm, "Son güncelleme: 2 Ekim 2026")
    canvas.drawRightString(width - doc.rightMargin, 9.5 * mm, f"Sayfa {doc.page}")
    canvas.restoreState()


def bullet_list(items, styles):
    return ListFlowable(
        [ListItem(Paragraph(item, styles["Body"]), leftIndent=8) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=15,
        bulletFontName="Manrope",
        bulletFontSize=7,
        bulletColor=PRIMARY,
        spaceBefore=4,
        spaceAfter=8,
    )


def build_pdf() -> None:
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    base = getSampleStyleSheet()
    styles = {
        "Title": ParagraphStyle(
            "Title", parent=base["Title"], fontName="Manrope-Bold", fontSize=29, leading=34,
            textColor=colors.white, alignment=TA_LEFT, spaceAfter=7,
        ),
        "Kicker": ParagraphStyle(
            "Kicker", parent=base["Normal"], fontName="Manrope-SemiBold", fontSize=8.2,
            leading=11, textColor=colors.HexColor("#F1D37A"), tracking=1.6, spaceAfter=7,
        ),
        "Lead": ParagraphStyle(
            "Lead", parent=base["Normal"], fontName="Manrope", fontSize=11.2, leading=17,
            textColor=colors.HexColor("#D9EBE0"), spaceAfter=18,
        ),
        "H1": ParagraphStyle(
            "H1", parent=base["Heading1"], fontName="Manrope-Bold", fontSize=16, leading=21,
            textColor=DEEP, spaceBefore=15, spaceAfter=7, keepWithNext=True,
        ),
        "H2": ParagraphStyle(
            "H2", parent=base["Heading2"], fontName="Manrope-SemiBold", fontSize=11.5, leading=16,
            textColor=PRIMARY, spaceBefore=10, spaceAfter=4, keepWithNext=True,
        ),
        "Body": ParagraphStyle(
            "Body", parent=base["BodyText"], fontName="Manrope", fontSize=9.3, leading=15.2,
            textColor=INK, spaceAfter=7,
        ),
        "Small": ParagraphStyle(
            "Small", parent=base["BodyText"], fontName="Manrope", fontSize=8, leading=12.5,
            textColor=MUTED,
        ),
        "CardTitle": ParagraphStyle(
            "CardTitle", parent=base["BodyText"], fontName="Manrope-SemiBold", fontSize=10,
            leading=13, textColor=PRIMARY, alignment=TA_CENTER, spaceAfter=3,
        ),
        "CardBody": ParagraphStyle(
            "CardBody", parent=base["BodyText"], fontName="Manrope", fontSize=7.7,
            leading=11.5, textColor=MUTED, alignment=TA_CENTER,
        ),
        "Contact": ParagraphStyle(
            "Contact", parent=base["BodyText"], fontName="Manrope", fontSize=9.2,
            leading=15, textColor=INK,
        ),
    }

    story = [
        Spacer(1, 4 * mm),
        Paragraph("GİZLİLİK POLİTİKASI", styles["Kicker"]),
        Paragraph("Veriniz cihazınızda kalır.", styles["Title"]),
        Paragraph(
            "Vakit, namaz vakitlerini ve kıble yönünü cihazınızda hesaplar. "
            "Hesap, reklam, analiz ve geliştirici sunucusu kullanmaz.",
            styles["Lead"],
        ),
        Spacer(1, 13 * mm),
    ]

    cards = Table(
        [
            [Paragraph("Sunucu yok", styles["CardTitle"]), Paragraph("İzinler isteğe bağlı", styles["CardTitle"]), Paragraph("Silme sizde", styles["CardTitle"])],
            [Paragraph("Kişisel veriler geliştiriciye iletilmez.", styles["CardBody"]), Paragraph("GPS yerine manuel şehir seçebilirsiniz.", styles["CardBody"]), Paragraph("Android'den uygulama verilerini temizleyebilirsiniz.", styles["CardBody"])],
        ],
        colWidths=[doc_width() / 3] * 3,
        rowHeights=[9 * mm, 17 * mm],
    )
    cards.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
        ("BOX", (0, 0), (-1, -1), .6, LINE),
        ("INNERGRID", (0, 0), (-1, -1), .5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.extend([
        cards,
        Spacer(1, 6 * mm),
        Paragraph("1. Uygulamanın amacı", styles["H1"]),
        Paragraph(
            "Bu Gizlilik Politikası, <b>Vakit</b> Android uygulamasının kullanıcı ve cihaz "
            "verilerine nasıl eriştiğini, bunları hangi amaçlarla kullandığını, nerede tuttuğunu "
            "ve nasıl silebileceğinizi açıklar.", styles["Body"]),
        Paragraph(
            "Vakit; seçtiğiniz veya cihazınızdan aldığınız Türkiye konumuna göre namaz vakitlerini, "
            "sıradaki vakti ve kıble yönünü cihazınızda hesaplar. Aylık takvim, Ramazan imsakiyesi, "
            "tema seçenekleri ve isteğe bağlı yerel bildirimler sunar.", styles["Body"]),
    ])

    note = Table([[Paragraph("<b>Bağımsızlık açıklaması:</b> Vakit bir Diyanet uygulaması değildir ve resmî Diyanet verisi sunduğunu iddia etmez.", styles["Body"])]], colWidths=[doc_width()])
    note.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GOLD_SOFT),
        ("LINEBEFORE", (0, 0), (0, -1), 3, GOLD),
        ("LEFTPADDING", (0, 0), (-1, -1), 11),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.extend([note, PageBreak()])

    story.extend([
        Paragraph("2. Erişilen ve cihazda işlenen veriler", styles["H1"]),
        Paragraph("Konum bilgisi", styles["H2"]),
        bullet_list([
            "“Konumumu bul” veya canlı kıble pusulası özelliğini seçtiğinizde Android'in yalnız uygulama kullanımdayken konum izni istenir.",
            "Konum; namaz vakitlerini, güneş olaylarını, kıble açısını ve yakın yer adını cihazda hesaplamak için kullanılır.",
            "Son seçilen koordinat, yaklaşık doğruluk, ölçüm zamanı, görünen yer adı ve saat dilimi sonraki açılışlarda kullanılmak üzere yalnız cihazdaki uygulama alanında saklanır.",
            "Arka plan konum izni istenmez. Uygulama kapalıyken konum takibi yapılmaz.",
            "GPS izni vermeden Türkiye şehir ve ilçelerinden manuel seçim yapabilirsiniz.",
        ], styles),
        Paragraph("Pusula başlığı", styles["H2"]),
        Paragraph(
            "Kıble ekranı açıkken cihazın yön sensöründen gerçek veya manyetik kuzey başlığı okunabilir. "
            "Canlı pusula başlığı yalnız ekrandaki yönlendirmeyi göstermek için anlık işlenir; saklanmaz "
            "ve cihaz dışına gönderilmez.", styles["Body"]),
        Paragraph("Tercihler ve bildirim planı", styles["H2"]),
        Paragraph(
            "Tema, konum, vakit düzeltmeleri, Hicri tarih düzeltmesi, bildirim seçimleri ve cihazda "
            "planlanan bildirimlerin özeti yerel olarak saklanır. Bildirim izni yalnız seçtiğiniz vakit "
            "hatırlatmalarını göstermek için kullanılır.", styles["Body"]),
        Paragraph(
            "Android'in “Alarmlar ve hatırlatıcılar” erişimi, etkinleştirilmiş bildirimleri mümkün "
            "olduğunca seçilen vakitte planlamak için kullanılabilir. İşletim sistemi ve cihaz ayarları "
            "teslim zamanını etkileyebilir.", styles["Body"]),
        Paragraph("3. Toplama, paylaşma ve izleme", styles["H1"]),
        Paragraph("Vakit:", styles["Body"]),
        bullet_list([
            "hesap veya kullanıcı profili oluşturmaz;",
            "ad, telefon numarası, rehber, fotoğraf, mikrofon, sağlık ya da ödeme verisi istemez;",
            "reklam, reklam kimliği, davranışsal profil veya kişiselleştirilmiş pazarlama kullanmaz;",
            "analiz, uzaktan hata raporlama veya geliştirici sunucusu kullanmaz;",
            "konumunuzu, tercihlerinizi veya kullanım bilgilerinizi geliştiriciye ya da üçüncü kişilere iletmez, satmaz ve paylaşmaz.",
        ], styles),
        Paragraph(
            "Uygulama içindeki kaynak bağlantılarını siz açarsanız bağlantı cihazınızın tarayıcısında "
            "açılır. Ziyaret ettiğiniz sitelerin veri uygulamaları kendi politikalarına tabidir.", styles["Body"]),
    ])

    story.extend([
        Paragraph("4. Yerel saklama, güvenlik ve silme", styles["H1"]),
        Paragraph(
            "Veriler Android'in uygulamaya ayrılmış yerel depolama alanında tutulur. Vakit ayrıca "
            "uygulama düzeyinde şifreli bir kasa kullandığını iddia etmez; koruma Android'in uygulama "
            "yalıtımı ve cihaz güvenliğine dayanır.", styles["Body"]),
        Paragraph(
            "Yerel veriler siz değiştirene veya silene kadar cihazda kalır. Tüm Vakit verilerini "
            "Android ayarlarından uygulama verilerini temizleyerek veya uygulamayı kaldırarak "
            "silebilirsiniz. Konum ve bildirim izinlerini Android ayarlarından dilediğiniz zaman geri "
            "alabilirsiniz.", styles["Body"]),
        Paragraph(
            "Geliştiriciye veri aktarılmadığı için geliştiricinin sunucusunda silinecek bir kullanıcı "
            "hesabı veya kişisel veri kaydı bulunmaz.", styles["Body"]),
        Paragraph("5. Çocukların gizliliği", styles["H1"]),
        Paragraph(
            "Vakit hesap veya kullanıcı profili oluşturmaz ve çocuklara ait kişisel verileri bilerek "
            "geliştiriciye iletmez. Uygulamanın Google Play hedef kitle seçimi yayımdan önce ayrıca "
            "doğrulanır; çocukların hedef kitleye eklenmesi halinde Google Play Families kuralları ayrıca uygulanır.",
            styles["Body"]),
        Paragraph("6. Kaynaklar ve üçüncü taraf yazılımlar", styles["H1"]),
        Paragraph(
            "Namaz vakti hesaplaması Adhan JS Türkiye yöntemiyle, kıble hesabı ve takvim işlemleri "
            "cihazda yapılır. GeoNames konum kataloğu uygulama paketine gömülüdür. Expo, React Native, "
            "Adhan JS ve Luxon gibi yazılım bileşenleri uygulamanın çalışması için kullanılır; Vakit bu "
            "bileşenler üzerinden kişisel veri ileten bir ağ isteği başlatmaz.", styles["Body"]),
        Paragraph("7. Haklarınız ve iletişim", styles["H1"]),
        Paragraph(
            "Konum iznini vermeme, daha önce verdiğiniz izni geri alma, manuel şehir seçme ve yerel "
            "verileri silme seçeneklerine sahipsiniz.", styles["Body"]),
    ])

    contact = Table(
        [[Paragraph("<b>Veri sorumlusu ve geliştirici</b><br/>Vakit uygulaması geliştiricisi<br/><font color='#315E45'>support.alemdem@gmail.com</font>", styles["Contact"])]],
        colWidths=[doc_width()],
    )
    contact.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
        ("BOX", (0, 0), (-1, -1), .6, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.extend([
        KeepTogether([contact, Spacer(1, 4 * mm)]),
        Paragraph(
            "Türkiye'deki kullanıcılar, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki "
            "haklarına ilişkin başvurularını bu iletişim adresi üzerinden iletebilir. Uygulama "
            "geliştiriciye kişisel veri aktarmadığı için bir talebin karşılanması sırasında cihazınızdaki "
            "kayıtlara uzaktan erişemeyiz.", styles["Body"]),
        Paragraph("8. Değişiklikler", styles["H1"]),
        Paragraph(
            "Uygulamanın veri uygulamaları veya izinleri değişirse bu politika güncellenir ve üstteki "
            "tarih yenilenir. Yeni bir sunucu, analiz, reklam veya hesap özelliği eklenmesi halinde "
            "Google Play Veri Güvenliği beyanı ve bu politika yayımdan önce yeniden değerlendirilir.",
            styles["Body"]),
        Spacer(1, 6 * mm),
        Paragraph(
            "Bu metin Vakit 0.2.0 uygulamasının 2 Ekim 2026 tarihli kaynak kodu ve yapılandırması "
            "temel alınarak hazırlanmıştır.", styles["Small"]),
    ])

    PolicyDocTemplate(str(OUTPUT)).build(story)


def doc_width() -> float:
    return A4[0] - 44 * mm


if __name__ == "__main__":
    build_pdf()
