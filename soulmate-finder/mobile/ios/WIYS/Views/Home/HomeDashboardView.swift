import SwiftUI

struct HomeDashboardView: View {
    @EnvironmentObject private var appState: AppState
    @State private var showGenerator = false
    @State private var showMatcher = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    HeaderSection()

                    VStack(spacing: 16) {
                        ActionCard(
                            title: "Soulmate’im neye benziyor?",
                            subtitle: "Profiline göre AI görseli oluştur.",
                            icon: "photo.on.rectangle.angled",
                            gradient: Gradient(colors: [.pink, .purple])
                        ) {
                            showGenerator = true
                        }

                        ActionCard(
                            title: "Bu kişi benim soulmate’im mi?",
                            subtitle: "Uyumluluk analizi al.",
                            icon: "person.2.circle",
                            gradient: Gradient(colors: [.purple, .indigo])
                        ) {
                            showMatcher = true
                        }
                    }

                    QuoteSection()

                    if !appState.soulmateImages.isEmpty {
                        SoulmateGallery(images: appState.soulmateImages.prefix(5))
                    }
                }
                .padding()
            }
            .navigationTitle("WIYS")
            .sheet(isPresented: $showGenerator) {
                SoulmateGeneratorView()
                    .environmentObject(appState)
            }
            .sheet(isPresented: $showMatcher) {
                SoulmateMatchCheckView()
                    .environmentObject(appState)
            }
        }
    }
}

private struct HeaderSection: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let name = appState.userProfile?.name {
                Text("Merhaba, \(name) ✨")
                    .font(.title.bold())
            }
            Text("Ruh eşini keşfetmeye hazır mısın?")
                .font(.headline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

private struct ActionCard: View {
    let title: String
    let subtitle: String
    let icon: String
    let gradient: Gradient
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                VStack(alignment: .leading, spacing: 8) {
                    Text(title)
                        .font(.headline)
                        .foregroundStyle(.white)
                    Text(subtitle)
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.9))
                }
                Spacer()
                Image(systemName: icon)
                    .font(.system(size: 32))
                    .foregroundStyle(.white)
            }
            .padding()
            .background(
                LinearGradient(gradient: gradient, startPoint: .topLeading, endPoint: .bottomTrailing)
                    .cornerRadius(20)
            )
            .shadow(color: .black.opacity(0.12), radius: 10, x: 0, y: 6)
        }
    }
}

private struct QuoteSection: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        if let quote = appState.dailyQuote {
            VStack(alignment: .leading, spacing: 12) {
                Text("Günün Soulmate Sözü")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.secondary)
                Text("\"\(quote.message)\"")
                    .font(.title3.weight(.medium))
                Text("— \(quote.author)")
                    .font(.callout)
                    .foregroundStyle(.secondary)
            }
            .padding()
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
        }
    }
}

private struct SoulmateGallery: View {
    let images: ArraySlice<SoulmateImage>

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Son Soulmate Görsellerin")
                .font(.headline)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(Array(images)) { image in
                        VStack(alignment: .leading, spacing: 8) {
                            AsyncImage(url: image.url) { phase in
                                switch phase {
                                case .empty:
                                    ProgressView()
                                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                                case let .success(renderedImage):
                                    renderedImage
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
                            .frame(width: 160, height: 160)
                            .clipShape(RoundedRectangle(cornerRadius: 16))

                            Text(image.prompt)
                                .font(.caption)
                                .lineLimit(2)
                        }
                        .frame(width: 160)
                    }
                }
            }
        }
    }
}

#Preview {
    HomeDashboardView()
        .environmentObject(AppState())
}
