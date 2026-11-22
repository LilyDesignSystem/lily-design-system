// Renders every LilyUI view with every built-in style and option, so each body and style runs (spec/apple-swift, Testing).
// What VoiceOver hears is tested through LilySemantics here and through the rendered accessibility tree in the example app's
// UI tests (tasks.md P44-T5).

import SwiftUI
import Testing

import LilyCore
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

private struct CustomBadgeStyle: BadgeStyle {
    func makeBody(configuration: BadgeStyleConfiguration) -> some View {
        HStack { Text(verbatim: configuration.kind.rawValue); configuration.text }
    }
}

private struct CustomTagStyle: TagStyle {
    func makeBody(configuration: TagStyleConfiguration) -> some View { configuration.text.italic() }
}

private struct CustomCardStyle: CardStyle {
    func makeBody(configuration: CardStyleConfiguration) -> some View { VStack { configuration.heading; configuration.content } }
}

private struct CustomInsetStyle: InsetTextStyle {
    func makeBody(configuration: InsetTextStyleConfiguration) -> some View { configuration.content.border(.secondary) }
}

@MainActor @Test func badgeRendersEveryKindInBothStyles() {
    for kind in BadgeKind.allCases { #expect(render(Badge("3", kind: kind, label: "3 unread messages"))) }
    #expect(render(Badge("New").badgeStyle(CustomBadgeStyle())))
    #expect(render(Badge("New").badgeStyle(.plain)))
    Badge("3", label: "3 unread").textChanged(from: "2", to: "3")
}

@MainActor @Test func tagRendersStaticAndLiveInBothStyles() {
    #expect(render(Tag("High", label: "priority")))
    #expect(render(Tag("Running", label: "Job status", live: true).tagStyle(CustomTagStyle())))
    #expect(render(Tag("Draft", label: "status").tagStyle(.plain)))
    Tag("Done", label: "Job status", live: true).textChanged(from: "Running", to: "Done")
    Tag("Done", label: "status").textChanged(from: "Draft", to: "Done")
}

@MainActor @Test func cardRendersWithAndWithoutHeadingAndLabel() {
    #expect(render(Card { Text(verbatim: "Body") }))
    #expect(render(Card(heading: "Appointment", headingLevel: 2, label: "Next appointment") { Text(verbatim: "Body") }))
    #expect(render(Card(heading: "Custom") { Text(verbatim: "Body") }.cardStyle(CustomCardStyle())))
    #expect(render(Card(heading: "Plain") { Text(verbatim: "Body") }.cardStyle(.plain)))
}

@MainActor @Test func insetTextRendersInBothStyles() {
    #expect(render(InsetText { Text(verbatim: "It can take up to 8 weeks.") }))
    #expect(render(InsetText { Text(verbatim: "Custom") }.insetTextStyle(CustomInsetStyle())))
    #expect(render(InsetText { Text(verbatim: "Plain") }.insetTextStyle(.plain)))
}

private struct CustomObservationStyle: ObservationViewStyle {
    func makeBody(configuration: ObservationViewStyleConfiguration) -> some View {
        VStack {
            configuration.value
            configuration.flag
            Text(verbatim: configuration.interpretation ?? "-")
            Text(verbatim: configuration.observationStatus.rawValue)
        }
    }
}

@MainActor @Test func observationViewRendersEveryStatusAndPart() {
    for status in ObservationStatus.allCases {
        #expect(
            render(
                ObservationView(
                    value: "6.1", unit: "mmol/L", interpretation: "H", flagLabel: "High", range: "3.5 to 5.5 mmol/L",
                    ranges: [.init(label: "Critical", text: "above 6.5")], status: status, statusLabel: "Status words",
                    previousValue: "5.1", previousLabel: "was 5.1 until 3 Nov", label: "Potassium", meterValue: 6.1,
                    meter: MeterScale(min: 2.5, max: 6.5, low: 3.5, high: 5.5))))
    }
    #expect(render(ObservationView(value: "4.2").observationViewStyle(CustomObservationStyle())))
    #expect(render(ObservationView(value: "4.2", interpretation: "N").observationViewStyle(.plain)))
    #expect(ObservationView(value: "4.2", unit: "mmol/L", label: "Potassium").spoken == "Potassium\n4.2\u{00A0}mmol/L")
}

@MainActor @Test func ageAndDurationViewsRenderAndParse() {
    #expect(render(AgeView("5 years 2 months", duration: "P5Y2M", label: "Age")))
    #expect(render(AgeView("3 weeks")))
    #expect(render(DurationView("3 days early", duration: "-P3D", label: "Delivery")))
    #expect(DurationView("3 days early", duration: "-P3D").parsed! == ("P3D", true))
    #expect(DurationView("1 year", duration: "P1Y").parsed == nil)
    #expect(DurationView.warnings("P1Y").count == 1)
    #expect(DurationView.warnings("PT90M").isEmpty)
    #expect(render(DurationView("90 minutes", duration: "PT90M")))
    // An empty value with no label still renders (and speaks nothing rather than crashing).
    #expect(render(AgeView("")))
    #expect(render(DurationView("", duration: "PT0S")))
}
