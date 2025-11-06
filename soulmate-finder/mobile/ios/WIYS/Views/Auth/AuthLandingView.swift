import SwiftUI

struct AuthLandingView: View {
    @EnvironmentObject private var appState: AppState
    @State private var isLoading = false
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            VStack(spacing: 12) {
                Text("WIYS")
                    .font(.system(size: 42, weight: .bold, design: .rounded))
                    .foregroundStyle(LinearGradient(colors: [.pink, .purple], startPoint: .leading, endPoint: .trailing))
                Text("Who Is Your Soulmate?")
                    .font(.title3.weight(.semibold))
                    .foregroundStyle(.secondary)
                Text("Eğlenceli soulmate keşfi için giriş yap.")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
            }
            Spacer()

            VStack(spacing: 16) {
                AuthButton(title: "Apple ile Giriş Yap", icon: "apple.logo") {
                    await authenticate(.apple)
                }
                AuthButton(title: "Google ile Giriş Yap", icon: "globe") {
                    await authenticate(.google)
                }

                VStack(spacing: 8) {
                    TextField("E-posta", text: $email)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                        .padding()
                        .background(RoundedRectangle(cornerRadius: 12).fill(Color(.secondarySystemBackground)))

                    SecureField("Şifre", text: $password)
                        .padding()
                        .background(RoundedRectangle(cornerRadius: 12).fill(Color(.secondarySystemBackground)))
                }

                Button(action: {
                    Task { await authenticate(.email(email: email, password: password)) }
                }) {
                    HStack {
                        if isLoading {
                            ProgressView()
                        }
                        Text("E-posta ile Giriş")
                            .fontWeight(.semibold)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(LinearGradient(colors: [.pink, .purple], startPoint: .leading, endPoint: .trailing))
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .disabled(isLoading || email.isEmpty || password.isEmpty)
            }
            .padding(.horizontal, 24)

            Spacer()
            Text("Giriş yaparak eğlenceli soulmate deneyimine katıl.")
                .font(.footnote)
                .foregroundStyle(.secondary)
                .padding(.bottom, 32)
        }
        .overlay(alignment: .topTrailing) {
            QuoteBadge()
                .padding()
        }
        .task {
            appState.refreshQuote()
        }
        .animation(.easeInOut, value: isLoading)
        .background(
            LinearGradient(colors: [Color(.systemBackground), Color(.systemBackground).opacity(0.6)], startPoint: .topLeading, endPoint: .bottomTrailing)
                .ignoresSafeArea()
        )
    }

    private func authenticate(_ method: AuthMethod) async {
        guard !isLoading else { return }
        isLoading = true
        await appState.signIn(with: method)
        await MainActor.run { isLoading = false }
    }
}

private struct AuthButton: View {
    let title: String
    let icon: String
    let action: () async -> Void
    @State private var isLoading = false

    var body: some View {
        Button(action: {
            Task {
                guard !isLoading else { return }
                isLoading = true
                await action()
                await MainActor.run { isLoading = false }
            }
        }) {
            HStack {
                Image(systemName: icon)
                Text(title)
                    .fontWeight(.semibold)
                Spacer()
                if isLoading {
                    ProgressView()
                }
            }
            .padding()
            .background(RoundedRectangle(cornerRadius: 14).strokeBorder(Color.purple.opacity(0.4), lineWidth: 1.5))
        }
        .tint(.primary)
    }
}

private struct QuoteBadge: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        if let quote = appState.dailyQuote {
            VStack(alignment: .leading, spacing: 4) {
                Text(quote.message)
                    .font(.footnote)
                    .fontWeight(.semibold)
                Text(quote.author)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            .padding(12)
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
        }
    }
}

#Preview {
    AuthLandingView()
        .environmentObject(AppState())
}
