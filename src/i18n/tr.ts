import { PrayerId } from '@/domain/types';

export const tr = {
  appName: 'Vakitname', today: 'Bugün', location: 'Konum', appearance: 'Görünüm',
  chooseLocation: 'Şehrini seç', useLocation: 'Konumumu kullan', chooseManually: 'Şehir veya ilçe seç',
  prayerNames: { imsak: 'İmsak', gunes: 'Güneş', ogle: 'Öğle', ikindi: 'İkindi', aksam: 'Akşam', yatsi: 'Yatsı' } satisfies Record<PrayerId, string>,
  locationErrors: {
    denied: 'Konum izni verilmedi. Şehir seçerek devam edebilirsin.',
    blocked: 'Konum izni kapalı. Cihaz ayarlarından açabilir veya şehir seçebilirsin.',
    disabled: 'Cihazın konum servisi kapalı. Şehir seçerek devam edebilirsin.',
    timeout: 'Konum bulunması biraz uzun sürdü. Yeniden deneyebilir veya şehir seçebilirsin.',
    'outside-turkey': 'Vakitname şu an Türkiye için hazır. Türkiye’den bir şehir seçebilirsin.',
    unavailable: 'Konum alınamadı. Şehir seçerek devam edebilirsin.',
  } as Record<string, string>,
};
