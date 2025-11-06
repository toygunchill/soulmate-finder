import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        switch appState.authState {
        case .loggedOut:
            AuthLandingView()
        case .authenticated:
            ProfileSetupView()
        case .profileComplete:
            MainTabView()
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
}
