import SwiftUI

struct SoulmateMatchCheckView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.dismiss) private var dismiss
    @State private var candidateName: String = ""
    @State private var candidateBirthDate: Date = Calendar.current.date(byAdding: .year, value: -25, to: Date()) ?? Date()
    @State private var candidateOccupation: String = ""
    @State private var candidateHobbiesInput: String = ""
    @State private var candidateHobbies: [String] = []
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Soulmate uyumluluğunu test et")
                            .font(.title2.weight(.semibold))
                        Text("Karşındaki kişinin bilgilerini doldur, AI uyumluluğu değerlendirsin.")
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    VStack(spacing: 16) {
                        TextField("Adı", text: $candidateName)
                            .textFieldStyle(.roundedBorder)
                        DatePicker("Doğum Tarihi", selection: $candidateBirthDate, displayedComponents: .date)
                        TextField("Mesleği", text: $candidateOccupation)
                            .textFieldStyle(.roundedBorder)

                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                TextField("Hobi ekle", text: $candidateHobbiesInput)
                                Button("Ekle") { addHobby() }
                                    .disabled(candidateHobbiesInput.isEmpty)
                            }
                            .textFieldStyle(.roundedBorder)

                            if candidateHobbies.isEmpty {
                                Text("Ortak ilgi alanlarını eklemeyi unutma!")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            } else {
                                FlowLayout(spacing: 8) {
                                    ForEach(candidateHobbies, id: \.self) { hobby in
                                        HStack(spacing: 6) {
                                            Text(hobby)
                                                .font(.caption)
                                            Image(systemName: "xmark.circle.fill")
                                                .font(.caption)
                                                .onTapGesture { removeHobby(hobby) }
                                        }
                                        .padding(.vertical, 6)
                                        .padding(.horizontal, 10)
                                        .background(.ultraThinMaterial, in: Capsule())
                                    }
                                }
                            }
                        }
                    }

                    if let result = appState.latestMatchResult {
                        ResultCard(result: result)
                    }

                    Button(action: requestMatchCheck) {
                        HStack {
                            if isLoading { ProgressView() }
                            Text("Analiz Et")
                                .fontWeight(.semibold)
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(LinearGradient(colors: [.indigo, .purple], startPoint: .leading, endPoint: .trailing))
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                    .disabled(!isFormValid || isLoading)
                }
                .padding()
            }
            .navigationTitle("Soulmate Analizi")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Kapat") { dismiss() }
                }
            }
        }
    }

    private var isFormValid: Bool {
        !candidateName.isEmpty && !candidateOccupation.isEmpty && !candidateHobbies.isEmpty
    }

    private func addHobby() {
        let trimmed = candidateHobbiesInput.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        candidateHobbies.append(trimmed)
        candidateHobbiesInput = ""
    }

    private func removeHobby(_ hobby: String) {
        candidateHobbies.removeAll { $0 == hobby }
    }

    private func requestMatchCheck() {
        guard !isLoading else { return }
        isLoading = true
        let candidate = SoulmateCandidate(
            name: candidateName,
            birthDate: candidateBirthDate,
            occupation: candidateOccupation,
            hobbies: candidateHobbies
        )

        Task {
            await appState.checkSoulmateMatch(with: candidate)
            await MainActor.run { isLoading = false }
        }
    }
}

private struct ResultCard: View {
    let result: SoulmateMatchResult

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Uyumluluk: %\(result.compatibilityScore)")
                .font(.title.weight(.bold))
            Text(result.summary)
                .font(.body)
            ShareLink(item: result.summary) {
                Label("Paylaş", systemImage: "square.and.arrow.up")
            }
            .buttonStyle(.bordered)
        }
        .padding()
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
    }
}

#Preview {
    SoulmateMatchCheckView()
        .environmentObject(AppState())
}
