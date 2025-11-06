import AuthenticationServices
import Foundation

enum AuthMethod {
    case apple
    case google
    case email(email: String, password: String)
}

actor AuthService {
    static let shared = AuthService()

    func signIn(method: AuthMethod) async throws {
        // Placeholder implementation. Integrate with Firebase/Auth0/etc. here.
        try await Task.sleep(nanoseconds: 500_000_000)
    }
}
