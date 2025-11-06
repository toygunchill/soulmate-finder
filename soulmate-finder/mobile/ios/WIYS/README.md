# WIYS: Who Is Your Soulmate?

SwiftUI tabanlı iOS uygulaması örneği. Minimum iOS 16 desteği ile geliştirilmiş olup kullanıcıların ruh eşi görsellerini oluşturmasına ve uyumluluk analizleri yapmasına olanak tanır.

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
├── Models
├── Services
├── ViewModels
├── Views
│   ├── Auth
│   ├── Home
│   ├── Profile
│   └── Shared
└── WIYSApp.swift
```

Gerçek kimlik doğrulama ve backend entegrasyonu için `AuthService` ve `SoulmateService` içindeki stub noktalarını ilgili SDK çağrılarıyla güncelleyin.
