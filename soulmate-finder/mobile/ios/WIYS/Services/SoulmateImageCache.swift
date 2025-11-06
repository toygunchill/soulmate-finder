import Foundation

struct SoulmateImageCache {
    private let storageURL: URL = {
        let directory = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
        return directory.appendingPathComponent("soulmate_images.json")
    }()
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    func save(images: [SoulmateImage]) {
        do {
            let data = try encoder.encode(images)
            try data.write(to: storageURL)
        } catch {
            print("Failed to cache soulmate images: \(error)")
        }
    }

    func loadImages() -> [SoulmateImage] {
        do {
            let data = try Data(contentsOf: storageURL)
            return try decoder.decode([SoulmateImage].self, from: data)
        } catch {
            return []
        }
    }
}
