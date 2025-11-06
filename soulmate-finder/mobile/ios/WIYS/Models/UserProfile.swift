import Foundation

struct UserProfile: Codable, Identifiable, Equatable {
    var id: UUID = UUID()
    var name: String
    var birthDate: Date
    var occupation: String
    var hobbies: [String]

    var displayHobbies: String {
        hobbies.joined(separator: ", ")
    }
}

struct SoulmateCandidate: Identifiable {
    var id: UUID = UUID()
    var name: String
    var birthDate: Date
    var occupation: String
    var hobbies: [String]
}

struct SoulmateImage: Identifiable, Codable, Equatable {
    var id: UUID
    var url: URL
    var createdAt: Date
    var prompt: String
}

struct SoulmateMatchResult: Identifiable, Codable, Equatable {
    var id: UUID
    var compatibilityScore: Int
    var summary: String
    var createdAt: Date
    var candidate: SoulmateCandidateSummary

    struct SoulmateCandidateSummary: Codable, Equatable {
        var name: String
        var birthDate: Date
        var occupation: String
        var hobbies: [String]
    }
}

struct SoulmateQuote: Identifiable {
    let id = UUID()
    let message: String
    let author: String
}
