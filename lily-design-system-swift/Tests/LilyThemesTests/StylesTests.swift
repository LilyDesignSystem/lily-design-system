// The themed styles render every component in every generated theme, and read the tokens the environment gives them.

import LilyUI
import SwiftUI
import Testing

@testable import LilyThemes

@MainActor private func render(_ view: some View) -> Bool {
    ImageRenderer(content: view.frame(width: 320)).cgImage != nil
}

@MainActor @Test func everyComponentRendersInEveryTheme() {
    for tokens in LilyTokens.all {
        let screen = VStack {
            ForEach(AlertKind.allCases, id: \.self) { LilyAlert(kind: $0, heading: "Heading", message: "Message", politeness: .off) }
            ForEach(BadgeKind.allCases, id: \.self) { Badge("3", kind: $0) }
            Tag("High", label: "priority")
            Card(heading: "Appointment") { Text(verbatim: "Tuesday") }
            InsetText { Text(verbatim: "It can take up to 8 weeks.") }
            WarningText(prefix: "Warning", text: "You can be fined") { Text(verbatim: "!") }
            WarningText(prefix: "Warning", text: "No icon")
            SummaryList(label: "Details") { SummaryListItem(term: "Name") { Text(verbatim: "Sam Okoro") } }
        }
        #expect(render(screen.lilyTheme(tokens)), "\(tokens.slug)")
    }
}

@Test func severityPairsAreTheGatedFillAndContentPairs() {
    let t = LilyTokens.light
    #expect(t.pair(for: AlertKind.error) == (t.error, t.errorContent))
    #expect(t.pair(for: AlertKind.info) == (t.info, t.infoContent))
    #expect(t.pair(for: AlertKind.success) == (t.success, t.successContent))
    #expect(t.pair(for: AlertKind.warning) == (t.warning, t.warningContent))
    #expect(t.pair(for: BadgeKind.default) == (t.neutral, t.neutralContent))
    #expect(t.pair(for: BadgeKind.info) == (t.info, t.infoContent))
    #expect(t.pair(for: BadgeKind.success) == (t.success, t.successContent))
    #expect(t.pair(for: BadgeKind.warning) == (t.warning, t.warningContent))
    #expect(t.pair(for: BadgeKind.error) == (t.error, t.errorContent))
}

@MainActor @Test func theEnvironmentDefaultsToLight() {
    #expect(EnvironmentValues().lilyTokens == .light)
    var values = EnvironmentValues()
    values.lilyTokens = .dark
    #expect(values.lilyTokens.slug == "dark")
}
