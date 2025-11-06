import SwiftUI

struct ProfileView: View {
    @EnvironmentObject private var appState: AppState
    @State private var showEditProfile = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    if let profile = appState.userProfile {
                        ProfileHeader(profile: profile)
                    }

                    if !appState.soulmateImages.isEmpty {
                        SoulmateHistoryList(images: appState.soulmateImages)
                    } else {
                        EmptyStateView()
                    }

                    SettingsSection(showEditProfile: $showEditProfile)
                }
                .padding()
            }
            .navigationTitle("Profil")
            .sheet(isPresented: $showEditProfile) {
                ProfileSetupView()
                    .environmentObject(appState)
            }
        }
    }
}

private struct ProfileHeader: View {
    let profile: UserProfile

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "person.crop.circle.fill")
                .resizable()
                .frame(width: 120, height: 120)
                .foregroundStyle(LinearGradient(colors: [.pink, .purple], startPoint: .top, endPoint: .bottom))

            VStack(spacing: 4) {
                Text(profile.name)
                    .font(.title2.weight(.semibold))
                Text(profile.birthDate, style: .date)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                Text(profile.occupation)
                    .font(.headline)
            }

            HStack {
                Image(systemName: "sparkles")
                Text(profile.displayHobbies)
            }
            .font(.subheadline)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(.ultraThinMaterial, in: Capsule())
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(LinearGradient(colors: [.pink.opacity(0.2), .purple.opacity(0.1)], startPoint: .topLeading, endPoint: .bottomTrailing))
        )
    }
}

private struct SoulmateHistoryList: View {
    let images: [SoulmateImage]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Oluşturduğum Soulmate Görselleri")
                .font(.headline)

            ForEach(images) { image in
                VStack(alignment: .leading, spacing: 8) {
                    AsyncImage(url: image.url) { phase in
                        switch phase {
                        case .empty:
                            ProgressView()
                                .frame(maxWidth: .infinity)
                                .padding()
                        case let .success(image):
                            image
                                .resizable()
                                .scaledToFill()
                        case .failure:
                            ZStack {
                                Color.gray.opacity(0.2)
                                Image(systemName: "photo")
                            }
                        @unknown default:
                            EmptyView()
                        }
                    }
                    .frame(height: 200)
                    .clipShape(RoundedRectangle(cornerRadius: 20))

                    HStack {
                        VStack(alignment: .leading) {
                            Text(image.createdAt, style: .date)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            Text(image.prompt)
                                .font(.callout)
                                .lineLimit(2)
                        }
                        Spacer()
                        ShareLink(item: image.url) {
                            Image(systemName: "square.and.arrow.up")
                        }
                        .buttonStyle(.bordered)
                    }
                }
                .padding()
                .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 20))
            }
        }
    }
}

private struct SettingsSection: View {
    @Binding var showEditProfile: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Ayarlar")
                .font(.headline)
            Button("Profili Düzenle") { showEditProfile = true }
                .buttonStyle(.bordered)
            Button("Tema Seçimi (yakında)") {}
                .buttonStyle(.bordered)
            Button(role: .destructive, action: logout) {
                Text("Çıkış Yap")
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func logout() {
        // Implement logout integration with AuthService/Firebase.
    }
}

private struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "photo.on.rectangle.angled")
                .font(.system(size: 64))
                .foregroundStyle(.secondary)
            Text("Henüz bir soulmate görseli oluşturmadın.")
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 20))
    }
}

#Preview {
    ProfileView()
        .environmentObject(AppState())
}
