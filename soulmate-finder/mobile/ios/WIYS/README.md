# WIYS: Who Is Your Soulmate?

SwiftUI tabanlı iOS uygulaması örneği. Minimum iOS 16 desteği ile geliştirilmiş olup kullanıcıların ruh eşi görsellerini oluşturmasına ve uyumluluk analizleri yapmasına olanak tanır.


## Projeyi Açma
1. Xcode 15 veya üzeri bir sürüm kullanın.
2. Depoda `mobile/ios/WIYS/WIYS.xcodeproj` dosyasını açın.
3. Şemada **WIYS** hedefini seçip çalıştırarak SwiftUI önizlemelerini veya simülatör derlemesini başlatın.

## Özellikler
- Apple/Google/E-posta ile giriş için stub servisler
- Profil oluşturma ve yerel olarak saklama
- AI görsel oluşturma ve geçmiş görüntüleme
- Soulmate uyumluluk analizi ve paylaşım
- Günlük soulmate sözü
- Gradient temalı modern arayüz ve paylaşım entegrasyonu

## Yapı
```
WIYS
├── Resources
│   ├── Assets.xcassets
│   ├── Info.plist
│   └── Preview Content
│       └── Preview Assets.xcassets
├── Models
├── Services
├── ViewModels
├── Views
│   ├── Auth
│   ├── Home
│   ├── Profile
│   └── Shared
├── WIYS.xcodeproj
└── WIYSApp.swift
```

Gerçek kimlik doğrulama ve backend entegrasyonu için `AuthService` ve `SoulmateService` içindeki stub noktalarını ilgili SDK çağrılarıyla güncelleyin.
