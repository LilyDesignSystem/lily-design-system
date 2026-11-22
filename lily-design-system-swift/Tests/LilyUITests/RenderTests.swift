// Renders every LilyUI view with every built-in style and option, so each body and style runs (spec/apple-swift, Testing).
// What VoiceOver hears is tested through LilySemantics here and through the rendered accessibility tree in the example app's
// UI tests (tasks.md P44-T5).

import SwiftUI
import Testing

@testable import LilyUI

@MainActor private func render(_ view: some View) -> Bool {
    let renderer = ImageRenderer(content: view.frame(width: 320))
    return renderer.cgImage != nil
}

private struct CustomWarningStyle: WarningTextStyle {
    func makeBody(configuration: WarningTextStyleConfiguration) -> some View {
        VStack { Text(verbatim: configuration.prefix); configuration.icon; configuration.message }
    }
}

private struct CustomAlertStyle: LilyAlertStyle {
    func makeBody(configuration: LilyAlertStyleConfiguration) -> some View {
        HStack { Text(verbatim: configuration.kind.rawValue); configuration.heading; configuration.message }
    }
}

private struct CustomErrorSummaryStyle: ErrorSummaryStyle {
    func makeBody(configuration: ErrorSummaryStyleConfiguration) -> some View {
        VStack { configuration.title; configuration.items }
    }
}

private struct CustomFieldStyle: FieldStyle {
    func makeBody(configuration: FieldStyleConfiguration) -> some View {
        VStack {
            configuration.label
            if configuration.required { Text(verbatim: "!") }
            configuration.description
            configuration.error
            configuration.control
        }
    }
}

private struct CustomItemStyle: SummaryListItemStyle {
    func makeBody(configuration: SummaryListItemStyleConfiguration) -> some View {
        HStack { configuration.term; configuration.value }
    }
}

@MainActor @Test func warningTextRendersWithAndWithoutAnIconInBothStyles() {
    #expect(render(WarningText(prefix: "Warning", text: "You can be fined")))
    #expect(render(WarningText(prefix: "Warning", text: "You can be fined") { Text(verbatim: "!") }))
    #expect(render(WarningText(prefix: "Warning", text: "Fined") { Text(verbatim: "!") }.warningTextStyle(CustomWarningStyle())))
    #expect(render(WarningText(prefix: "Warning", text: "Fined").warningTextStyle(.plain)))
}

@MainActor @Test func alertRendersEveryKindAndPoliteness() {
    for kind in AlertKind.allCases {
        for politeness in Politeness.allCases {
            #expect(render(LilyAlert(kind: kind, heading: "Heading", message: "Message", politeness: politeness)))
        }
    }
    #expect(render(LilyAlert(message: "No heading")))
    #expect(render(LilyAlert(message: "Custom").lilyAlertStyle(CustomAlertStyle())))
    #expect(render(LilyAlert(message: "Plain").lilyAlertStyle(.plain)))
}

@MainActor @Test func errorSummaryRendersWithProblemsAndWithoutFocus() {
    var chosen: [String] = []
    let problems = [ErrorSummary.Problem("Enter your name") { chosen.append("name") }]
    #expect(render(ErrorSummary(title: "There is a problem", problems: problems)))
    #expect(render(ErrorSummary(title: "There is a problem", problems: [], focusOnAppear: false)))
    #expect(render(ErrorSummary(title: "Custom", problems: problems).errorSummaryStyle(CustomErrorSummaryStyle())))
    #expect(render(ErrorSummary(title: "Plain", problems: problems).errorSummaryStyle(.plain)))
    problems[0].action()
    #expect(chosen == ["name"])
}

@MainActor @Test func fieldRendersEveryCombination() {
    #expect(render(Field(label: "Name") { TextField("", text: .constant("")) }))
    #expect(
        render(
            Field(label: "Name", description: "As on your passport", error: "Enter your name", required: true,
                  requiredLabel: "required") { TextField("", text: .constant("")) }))
    #expect(render(Field(label: "Name", required: true) { Toggle(isOn: .constant(true)) { EmptyView() } }.fieldStyle(CustomFieldStyle())))
    #expect(render(Field(label: "Name") { TextField("", text: .constant("")) }.fieldStyle(.plain)))
}

@MainActor @Test func summaryListRendersItemsInBothStyles() {
    #expect(render(SummaryList(label: "Personal details") { SummaryListItem(term: "Name") { Text(verbatim: "Sam Okoro") } }))
    #expect(
        render(
            SummaryList(label: "Details") { SummaryListItem(term: "Name") { Text(verbatim: "Sam") } }
                .summaryListItemStyle(CustomItemStyle())))
    #expect(render(SummaryListItem(term: "Name") { Text(verbatim: "Sam") }.summaryListItemStyle(.plain)))
}

@MainActor @Test func changesAnnounceWithoutFailing() {
    let alert = LilyAlert(message: "Saved", politeness: .polite)
    alert.announce()
    alert.messageChanged(from: "Saving", to: "Saved")
    LilySemantics.errorChanged(from: nil, to: "Enter your name")
    LilySemantics.errorChanged(from: "Enter your name", to: nil)
}

@MainActor @Test func announcePostsWithoutFailing() {
    LilySemantics.announce(LilySemantics.announcement(heading: nil, message: "Saved", politeness: .polite))
    LilySemantics.announce(nil)
}

@Test func politenessHasThreeCases() {
    #expect(Politeness.allCases == [.assertive, .polite, .off])
}
