import Foundation

struct SoulmateQuoteProvider {
    private let quotes: [SoulmateQuote] = [
        SoulmateQuote(message: "Your soulmate might be closer than you think 💫", author: "WIYS"),
        SoulmateQuote(message: "Love finds the ones who dare to imagine it first.", author: "Aurora Bloom"),
        SoulmateQuote(message: "Every heartbeat is a compass guiding you toward your person.", author: "Eli Star"),
        SoulmateQuote(message: "Two souls, one constellation.", author: "Celeste"),
        SoulmateQuote(message: "Serendipity is the language of soulmates.", author: "Unknown"),
    ]

    func randomQuote() -> SoulmateQuote {
        quotes.randomElement() ?? quotes[0]
    }
}
