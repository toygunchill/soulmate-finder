import SwiftUI

struct ProfileSetupView: View {
    @EnvironmentObject private var appState: AppState
    @State private var name: String = ""
    @State private var birthDate: Date = Calendar.current.date(byAdding: .year, value: -25, to: Date()) ?? Date()
    @State private var occupation: String = ""
    @State private var hobbyInput: String = ""
    @State private var hobbies: [String] = []

    var body: some View {
        NavigationStack {
            Form {
                Section("Kendini Tanıt") {
                    TextField("Adın", text: $name)
                    DatePicker("Doğum Tarihi", selection: $birthDate, displayedComponents: .date)
                    TextField("Mesleğin", text: $occupation)
                }

                Section("Hobilerin") {
                    HStack {
                        TextField("Hobi ekle", text: $hobbyInput)
                        Button("Ekle") {
                            addHobby()
                        }
                        .disabled(hobbyInput.isEmpty)
                    }

                    if hobbies.isEmpty {
                        Text("Hobi ekleyerek AI görsellerini daha kişisel hale getir.")
                            .foregroundStyle(.secondary)
                    } else {
                        FlexibleTagCloud(tags: hobbies, removeAction: removeHobby)
                    }
                }
            }
            .navigationTitle("Profilini Tamamla")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Kaydet") {
                        let profile = UserProfile(
                            name: name,
                            birthDate: birthDate,
                            occupation: occupation,
                            hobbies: hobbies
                        )
                        appState.completeProfile(profile)
                    }
                    .disabled(!isValid)
                }
            }
            .onAppear(perform: prefillIfNeeded)
        }
    }

    private var isValid: Bool {
        !name.isEmpty && !occupation.isEmpty && !hobbies.isEmpty
    }

    private func addHobby() {
        let trimmed = hobbyInput.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        hobbies.append(trimmed)
        hobbyInput = ""
    }

    private func removeHobby(_ hobby: String) {
        hobbies.removeAll { $0 == hobby }
    }

    private func prefillIfNeeded() {
        if let profile = appState.userProfile {
            name = profile.name
            birthDate = profile.birthDate
            occupation = profile.occupation
            hobbies = profile.hobbies
        }
    }
}

private struct FlexibleTagCloud: View {
    let tags: [String]
    let removeAction: (String) -> Void

    var body: some View {
        FlowLayout(spacing: 8) {
            ForEach(tags, id: \.self) { tag in
                HStack(spacing: 6) {
                    Text(tag)
                        .font(.caption)
                    Image(systemName: "xmark.circle.fill")
                        .font(.caption)
                        .onTapGesture { removeAction(tag) }
                }
                .padding(.vertical, 6)
                .padding(.horizontal, 10)
                .background(.ultraThinMaterial, in: Capsule())
            }
        }
    }
}

#Preview {
    ProfileSetupView()
        .environmentObject(AppState())
}
