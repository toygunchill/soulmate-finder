import SwiftUI

struct SoulmateGeneratorView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.dismiss) private var dismiss
    @State private var isLoading = false
    @State private var generatedImage: SoulmateImage?

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                if let image = generatedImage ?? appState.soulmateImages.first {
                    AsyncImage(url: image.url) { phase in
                        switch phase {
                        case .empty:
                            ProgressView()
                                .frame(maxWidth: .infinity, maxHeight: .infinity)
                        case let .success(image):
                            image
                                .resizable()
                                .scaledToFit()
                                .clipShape(RoundedRectangle(cornerRadius: 24))
                                .shadow(radius: 20)
                        case .failure:
                            Image(systemName: "photo")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 200, height: 200)
                                .foregroundStyle(.secondary)
                        @unknown default:
                            EmptyView()
                        }
                    }
                    .frame(maxHeight: 360)
                    .padding()

                    if let prompt = (generatedImage ?? appState.soulmateImages.first)?.prompt {
                        Text(prompt)
                            .font(.callout)
                            .foregroundStyle(.secondary)
                            .padding(.horizontal)
                    }

                    if let shareURL = (generatedImage ?? appState.soulmateImages.first)?.url {
                        ShareLink(item: shareURL) {
                            Label("Paylaş", systemImage: "square.and.arrow.up")
                        }
                        .buttonStyle(.borderedProminent)
                    }
                } else {
                    Spacer()
                    Text("Henüz soulmate görseli oluşturmadın.")
                        .foregroundStyle(.secondary)
                    Spacer()
                }

                Button(action: generateImage) {
                    HStack {
                        if isLoading { ProgressView() }
                        Text("Tekrar Oluştur")
                            .fontWeight(.semibold)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(LinearGradient(colors: [.pink, .purple], startPoint: .leading, endPoint: .trailing))
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                }
                .padding(.horizontal)
                .disabled(isLoading)

                Spacer()
            }
            .navigationTitle("Soulmate Görseli")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Kapat") { dismiss() }
                }
            }
            .onAppear {
                generatedImage = appState.soulmateImages.first
            }
            .background(
                LinearGradient(colors: [.pink.opacity(0.1), .purple.opacity(0.2)], startPoint: .top, endPoint: .bottom)
                    .ignoresSafeArea()
            )
        }
    }

    private func generateImage() {
        guard !isLoading else { return }
        isLoading = true
        Task {
            await appState.requestSoulmateImage()
            await MainActor.run {
                generatedImage = appState.soulmateImages.first
                isLoading = false
            }
        }
    }
}

#Preview {
    SoulmateGeneratorView()
        .environmentObject(AppState())
}
