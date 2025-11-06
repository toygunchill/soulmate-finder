import Foundation
import SwiftUI

final class AppState: ObservableObject {
    @Published var authState: AuthState = .loggedOut
    @Published var userProfile: UserProfile? {
        didSet {
            if let profile = userProfile {
                profileStore.save(profile: profile)
            }
        }
    }
    @Published var soulmateImages: [SoulmateImage] = [] {
        didSet { imageCache.save(images: soulmateImages) }
    }
    @Published var latestMatchResult: SoulmateMatchResult?
    @Published var dailyQuote: SoulmateQuote?

    private let profileStore = ProfileStore()
    private let imageCache = SoulmateImageCache()
    private let quoteProvider = SoulmateQuoteProvider()
    private let soulmateService = SoulmateService()

    init() {
        if let profile = profileStore.loadProfile() {
            userProfile = profile
            authState = .profileComplete
        }
        soulmateImages = imageCache.loadImages()
        refreshQuote()
    }

    func signIn(with method: AuthMethod) async {
        do {
            try await AuthService.shared.signIn(method: method)
            await MainActor.run {
                self.authState = self.userProfile == nil ? .authenticated : .profileComplete
            }
        } catch {
            print("Auth error: \(error)")
        }
    }

    func completeProfile(_ profile: UserProfile) {
        userProfile = profile
        authState = .profileComplete
    }

    func requestSoulmateImage() async {
        guard let profile = userProfile else { return }
        do {
            let image = try await soulmateService.generateSoulmateImage(for: profile)
            await MainActor.run {
                soulmateImages.insert(image, at: 0)
            }
        } catch {
            print("Image generation error: \(error)")
        }
    }

    func checkSoulmateMatch(with candidate: SoulmateCandidate) async {
        do {
            let result = try await soulmateService.checkSoulmateMatch(candidate: candidate, userProfile: userProfile)
            await MainActor.run {
                self.latestMatchResult = result
            }
        } catch {
            print("Match error: \(error)")
        }
    }

    func refreshQuote() {
        dailyQuote = quoteProvider.randomQuote()
    }
}

enum AuthState {
    case loggedOut
    case authenticated
    case profileComplete
}
