# Soulmate Finder

Bu depo, Next.js ile geliştirilen web uygulamasını ve Expo tabanlı mobil
uygulama yapılandırmasını içerir. Mobil klasörü, projeyi iOS üzerinde Expo
kullanarak derleyip dağıtmanızı sağlar.

## Web Uygulaması (Next.js)

```bash
cd soulmate-finder
pnpm install
pnpm dev
```

## Mobil Uygulama (Expo)

Mobil proje `soulmate-finder/mobile` klasöründe bulunur ve Expo Router kullanır.
Expo CLI global olarak yüklü değilse `pnpm dlx expo` komutlarını kullanabilirsiniz.

```bash
cd soulmate-finder/mobile
pnpm install
pnpm start   # Expo geliştirici sunucusunu başlatır
pnpm ios     # Bir iOS simülatöründe projeyi çalıştırır (macOS gerektirir)
```

iOS için yerel bir Xcode projesi üretmek isterseniz `pnpm dlx expo prebuild -p ios`
komutunu çalıştırabilir, ardından `pnpm ios` veya Xcode üzerinden derleme
alabilirsiniz. `app.json` dosyasında yer alan `bundleIdentifier` değerini EAS
veya App Store dağıtımı sırasında ihtiyaçlarınıza göre güncelleyebilirsiniz.

## Klasör Yapısı

- `soulmate-finder/` – Next.js web uygulaması
- `soulmate-finder/mobile/` – Expo ile iOS/Android hedeflerine
  hazırlanmış mobil proje
