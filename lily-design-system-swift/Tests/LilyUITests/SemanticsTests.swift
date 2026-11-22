// One test per accessibility decision the components make (spec/apple-swift, Testing). The rendered accessibility tree is
// tested by UI tests in the example app (tasks.md P44-T5).

import SwiftUI
import Testing

@testable import LilyUI

@Test func spokenJoinsConsumerTextWithALineBreakOnly() {
    #expect(LilySemantics.spoken("Error", "Enter a date") == "Error\nEnter a date")
    #expect(LilySemantics.spoken(nil, "", "Only") == "Only")
    #expect(LilySemantics.spoken(nil, "") == nil)
}

@Test func fieldHintPutsTheErrorFirstThenTheDescriptionThenRequired() {
    #expect(
        LilySemantics.fieldHint(
            description: "For example, 15 3 1984", error: "Enter your date of birth", required: true,
            requiredLabel: "required") == "Enter your date of birth\nFor example, 15 3 1984\nrequired")
}

@Test func fieldHintSaysRequiredOnlyWithTheConsumersWord() {
    #expect(LilySemantics.fieldHint(description: nil, error: nil, required: true, requiredLabel: nil) == nil)
    #expect(LilySemantics.fieldHint(description: nil, error: nil, required: false, requiredLabel: "required") == nil)
}

@Test func announcementPriorityFollowsPoliteness() throws {
    let assertive = try #require(
        LilySemantics.announcement(heading: "Saved", message: "Your changes were saved", politeness: .assertive))
    #expect(String(assertive.characters) == "Saved\nYour changes were saved")
    #expect(assertive.accessibilitySpeechAnnouncementPriority == .high)
    let polite = try #require(LilySemantics.announcement(heading: nil, message: "Loading", politeness: .polite))
    #expect(polite.accessibilitySpeechAnnouncementPriority == .default)
    #expect(LilySemantics.announcement(heading: nil, message: "Quiet", politeness: .off) == nil)
    #expect(LilySemantics.announcement(heading: nil, message: "", politeness: .assertive) == nil)
}

@MainActor @Test func componentsBuildWithoutDefaultText() {
    // Every text is the caller's; these compile only with the required words given.
    _ = WarningText(prefix: "Warning", text: "You can be fined up to £5,000")
    _ = LilyAlert(kind: .success, heading: "Saved", message: "Your changes were saved", politeness: .polite)
    _ = ErrorSummary(title: "There is a problem", problems: [.init("Enter your name") {}])
    _ = Field(label: "Name", error: "Enter your name", required: true, requiredLabel: "required") { TextField("", text: .constant("")) }
    _ = SummaryList(label: "Personal details") { SummaryListItem(term: "Name") { Text(verbatim: "Sam Okoro") } }
}

@Test func badgeSpeaksItsLabelOrElseItsText() {
    #expect(LilySemantics.badgeLabel(text: "3", label: "3 unread messages") == "3 unread messages")
    #expect(LilySemantics.badgeLabel(text: "New", label: nil) == "New")
    #expect(LilySemantics.badgeLabel(text: "New", label: "") == "New")
}

@Test func tagSpeaksTextThenLabelOrTheLabelAloneWhenLive() {
    #expect(LilySemantics.tagLabel(text: "High", label: "priority", live: false) == "High\npriority")
    #expect(LilySemantics.tagLabel(text: "Running", label: "Job status", live: true) == "Job status")
}

@Test func headingLevelsMapOneToOne() {
    #expect(HeadingLevel.allCases.map(LilySemantics.headingLevel) == [.h2, .h3, .h4, .h5, .h6])
    #expect(HeadingLevel(rawValue: 1) == nil)  // out of range is not representable, never clamped
    #expect(HeadingLevel(rawValue: 7) == nil)
}
