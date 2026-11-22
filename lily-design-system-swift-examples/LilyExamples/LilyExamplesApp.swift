// The iOS and iPadOS example app (tasks.md P44-T5): the catalog of every LilyUI component, themed with LilyThemes and light
// or dark with the system. The words are the app's (English demo content through the parameters an app localises).

import LilyThemes
import LilyUIExamples
import SwiftUI

@main
struct LilyExamplesApp: App {
    var body: some Scene {
        WindowGroup { CatalogScreen() }
    }
}

struct CatalogScreen: View {
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        ExampleCatalog(title: "Components", searchPrompt: "Search components")
            .lilyTheme(colorScheme == .dark ? .dark : .light)
    }
}
