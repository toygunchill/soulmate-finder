import Foundation

struct ProfileStore {
    private let storageURL: URL = {
        let directory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        return directory.appendingPathComponent("user_profile.json")
    }()
    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }()
    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()

    func save(profile: UserProfile) {
        do {
            let data = try encoder.encode(profile)
            try data.write(to: storageURL)
        } catch {
            print("Failed to persist profile: \(error)")
        }
    }

    func loadProfile() -> UserProfile? {
        do {
            let data = try Data(contentsOf: storageURL)
            return try decoder.decode(UserProfile.self, from: data)
        } catch {
            return nil
        }
    }
}
