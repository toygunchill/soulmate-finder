import Foundation
import SwiftUI

struct SoulmateService {
    private let baseURL = URL(string: "https://api.example.com")!
    private let useMockResponses: Bool
    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()
    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }()

    init(useMockResponses: Bool = true) {
        self.useMockResponses = useMockResponses
    }

    func generateSoulmateImage(for profile: UserProfile) async throws -> SoulmateImage {
        if useMockResponses {
            return mockImage(for: profile)
        }
        let endpoint = baseURL.appendingPathComponent("generateSoulmateImage")
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        let payload = SoulmateImageRequest(profile: profile)
        request.httpBody = try encoder.encode(payload)

        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try decoder.decode(SoulmateImageResponse.self, from: data)

        return SoulmateImage(
            id: response.id,
            url: response.imageURL,
            createdAt: response.createdAt,
            prompt: response.prompt
        )
    }

    func checkSoulmateMatch(candidate: SoulmateCandidate, userProfile: UserProfile?) async throws -> SoulmateMatchResult {
        if useMockResponses {
            return mockMatch(for: candidate, userProfile: userProfile)
        }
        let endpoint = baseURL.appendingPathComponent("checkSoulmateMatch")
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        let payload = SoulmateMatchRequest(candidate: candidate, userProfile: userProfile)
        request.httpBody = try encoder.encode(payload)

        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try decoder.decode(SoulmateMatchResponse.self, from: data)

        return SoulmateMatchResult(
            id: response.id,
            compatibilityScore: response.compatibilityScore,
            summary: response.summary,
            createdAt: response.createdAt,
            candidate: .init(
                name: response.candidate.name,
                birthDate: response.candidate.birthDate,
                occupation: response.candidate.occupation,
                hobbies: response.candidate.hobbies
            )
        )
    }
}

// MARK: - Mock Helpers

extension SoulmateService {
    private func mockImage(for profile: UserProfile) -> SoulmateImage {
        let prompt = "A dreamy portrait of \(profile.name)'s soulmate who loves \(profile.displayHobbies.lowercased())."
        let url = URL(string: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80")!
        return SoulmateImage(id: UUID(), url: url, createdAt: Date(), prompt: prompt)
    }

    private func mockMatch(for candidate: SoulmateCandidate, userProfile: UserProfile?) -> SoulmateMatchResult {
        let score = Int.random(in: 60...98)
        let summary: String
        if let user = userProfile {
            let sharedHobbies = Array(Set(user.hobbies).intersection(candidate.hobbies))
            let hobbiesText = sharedHobbies.isEmpty ? "ortak tutkular" : sharedHobbies.joined(separator: ", ")
            summary = "\(user.name) ve \(candidate.name) arasında %\(score) uyum var! Ortak hobiler: \(hobbiesText)."
        } else {
            summary = "%\(score) uyum! Ortak tutkular kalpleri yakınlaştırıyor."
        }
        return SoulmateMatchResult(
            id: UUID(),
            compatibilityScore: score,
            summary: summary,
            createdAt: Date(),
            candidate: .init(
                name: candidate.name,
                birthDate: candidate.birthDate,
                occupation: candidate.occupation,
                hobbies: candidate.hobbies
            )
        )
    }
}

private struct SoulmateImageRequest: Codable {
    let user: SoulmateMatchRequest.UserProfilePayload

    init(profile: UserProfile) {
        self.user = .init(from: profile)
    }
}

private struct SoulmateImageResponse: Codable {
    let id: UUID
    let imageURL: URL
    let createdAt: Date
    let prompt: String
}

private struct SoulmateMatchRequest: Codable {
    let candidate: SoulmateCandidatePayload
    let user: UserProfilePayload?

    init(candidate: SoulmateCandidate, userProfile: UserProfile?) {
        self.candidate = .init(from: candidate)
        if let userProfile {
            self.user = .init(from: userProfile)
        } else {
            self.user = nil
        }
    }

    struct SoulmateCandidatePayload: Codable {
        let name: String
        let birthDate: Date
        let occupation: String
        let hobbies: [String]

        init(from candidate: SoulmateCandidate) {
            self.name = candidate.name
            self.birthDate = candidate.birthDate
            self.occupation = candidate.occupation
            self.hobbies = candidate.hobbies
        }
    }

    struct UserProfilePayload: Codable {
        let name: String
        let birthDate: Date
        let occupation: String
        let hobbies: [String]

        init(from profile: UserProfile) {
            self.name = profile.name
            self.birthDate = profile.birthDate
            self.occupation = profile.occupation
            self.hobbies = profile.hobbies
        }
    }
}

private struct SoulmateMatchResponse: Codable {
    let id: UUID
    let compatibilityScore: Int
    let summary: String
    let createdAt: Date
    let candidate: SoulmateMatchCandidateResponse

    struct SoulmateMatchCandidateResponse: Codable {
        let name: String
        let birthDate: Date
        let occupation: String
        let hobbies: [String]
    }
}
