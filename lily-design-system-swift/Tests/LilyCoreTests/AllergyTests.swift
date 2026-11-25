// One test per rule of allergy-record-list and its item.

import Testing

@testable import LilyCore

@Test func anyStatusButKnownShowsItsWordsAsTheOneItem() {
    for status in AllergyListStatus.allCases { #expect(AllergyRules.showsStatusItem(status) == (status != .known)) }
}

@Test func theListIsNamedByItsLabelElseItsStatusWords() {
    #expect(AllergyRules.listName(label: "Allergies", statusLabel: "No known allergies") == "Allergies")
    #expect(AllergyRules.listName(label: nil, statusLabel: "No known allergies") == "No known allergies")
    #expect(AllergyRules.listName(label: "", statusLabel: "Not recorded") == "Not recorded")
}

// HC-C5
@Test func aMissingStatusLabelWarns() {
    #expect(AllergyRules.listWarnings(statusLabel: nil).count == 1)
    #expect(AllergyRules.listWarnings(statusLabel: "").count == 1)
    #expect(AllergyRules.listWarnings(statusLabel: "Known allergies").isEmpty)
}

@Test func everyCodeWithoutWordsWarns() {
    let codes = AllergyCodes(severity: "severe", criticality: "high", clinicalStatus: "active", verificationStatus: "refuted")
    #expect(AllergyRules.itemWarnings(codes: codes, words: AllergyWords(substance: "Penicillin")).count == 4)
    let words = AllergyWords(
        substance: "Penicillin", severity: "Severe", criticality: "High risk", clinicalStatus: "Active",
        verificationStatus: "Refuted")
    #expect(AllergyRules.itemWarnings(codes: codes, words: words).isEmpty)
    #expect(AllergyRules.itemWarnings(codes: AllergyCodes(), words: AllergyWords(substance: "Penicillin")).isEmpty)
}

// HC-C11
@Test func anItemSpeaksWhoseItIsFirstThenEveryPartInOrder() {
    let words = AllergyWords(
        subject: "Mother", substance: "Peanut", reaction: "Anaphylaxis", severity: "Severe", criticality: "High risk",
        clinicalStatus: "Active", verificationStatus: "Confirmed", type: "Allergy", category: "Food", updated: "3 Nov 2026")
    #expect(
        AllergyRules.spoken(words)
            == "Mother\nPeanut\nAnaphylaxis\nSevere\nHigh risk\nActive\nConfirmed\nAllergy\nFood\n3 Nov 2026")
    #expect(AllergyRules.spoken(AllergyWords(substance: "Latex", reaction: "")) == "Latex")
}

@Test func medicationSegmentsJoinIntoOneSpokenName() {
    let segments = [MedicationNameSegment("hydr"), MedicationNameSegment("OXY", tallMan: true), MedicationNameSegment("zine")]
    #expect(MedicationRules.name("ignored", segments: segments) == "hydrOXYzine")
    #expect(MedicationRules.name("Paracetamol", segments: []) == "Paracetamol")
    #expect(MedicationRules.name(nil, segments: []) == nil)
    #expect(
        MedicationRules.spoken(
            label: "Medication", name: nil, segments: segments, strength: "25\u{00A0}mg", form: "tablet", route: "oral",
            frequency: "twice a day", dosageText: "") == "Medication\nhydrOXYzine\n25\u{00A0}mg\ntablet\noral\ntwice a day")
}

@Test func earlyWarningBandsNeedWordsAndSpeakInOrder() {
    #expect(EarlyWarningScoreRules.warnings(band: "high", bandLabel: nil).count == 1)
    #expect(EarlyWarningScoreRules.warnings(band: "high", bandLabel: "").count == 1)
    #expect(EarlyWarningScoreRules.warnings(band: "high", bandLabel: "High clinical risk").isEmpty)
    #expect(EarlyWarningScoreRules.warnings(band: nil, bandLabel: nil).isEmpty)
    #expect(EarlyWarningScoreRules.warnings(band: "", bandLabel: nil).isEmpty)
    #expect(
        EarlyWarningScoreRules.spoken(
            label: "Early warning score", system: "NEWS2", score: "7", bandLabel: "High clinical risk",
            escalation: "Call the critical care outreach team") == "Early warning score\nNEWS2\n7\nHigh clinical risk\nCall the critical care outreach team")
}

// HC-C8, HC-C15
@Test func decisionSupportNamesItselfAndRefusesADismissalWithoutAReason() {
    #expect(DecisionSupportRules.name(label: nil, summary: "Interaction: warfarin and aspirin") == "Interaction: warfarin and aspirin")
    #expect(DecisionSupportRules.name(label: "", summary: "S") == "S")
    #expect(DecisionSupportRules.name(label: "Alert", summary: "S") == "Alert")
    #expect(DecisionSupportRules.dismiss(offered: [], chosen: nil) == .dismissed(reason: nil))
    #expect(DecisionSupportRules.dismiss(offered: ["patient-declined"], chosen: nil) == .refused)
    #expect(DecisionSupportRules.dismiss(offered: ["patient-declined"], chosen: "") == .refused)
    #expect(DecisionSupportRules.dismiss(offered: ["patient-declined"], chosen: "patient-declined") == .dismissed(reason: "patient-declined"))
    // HC-C15: a reason this card does not offer is refused.
    #expect(DecisionSupportRules.dismiss(offered: ["renal"], chosen: "patient-declined") == .refused)
    #expect(DecisionSupportRules.identity(cardId: "a", summary: "S", indicator: .info, sourceLabel: "R") == ["a"])
    #expect(DecisionSupportRules.identity(cardId: nil, summary: "S", indicator: .info, sourceLabel: "R") != DecisionSupportRules.identity(cardId: nil, summary: "T", indicator: .info, sourceLabel: "R"))
    #expect(DecisionSupportRules.warnings(summary: String(repeating: "a", count: 141), indicatorLabel: "", sourceLabel: "").count == 3)
    #expect(DecisionSupportRules.warnings(summary: "Short", indicatorLabel: "Warning", sourceLabel: "Local formulary").isEmpty)
    #expect(DecisionSupportIndicator.allCases.map(\.rawValue) == ["info", "warning", "critical"])
}

@Test func decisionSupportHintsAndReasonLabelWarnings() {
    #expect(DecisionSupportRules.reasonHint(refused: true, error: "Choose a reason") == "Choose a reason")
    #expect(DecisionSupportRules.reasonHint(refused: true, error: nil) == "")
    #expect(DecisionSupportRules.reasonHint(refused: false, error: "Choose a reason") == "")
    #expect(
        DecisionSupportRules.warnings(
            summary: "S", indicatorLabel: "I", sourceLabel: "R", reasonsOffered: true, overrideReasonLabel: nil
        ).count == 1)
    #expect(
        DecisionSupportRules.warnings(
            summary: "S", indicatorLabel: "I", sourceLabel: "R", reasonsOffered: true, overrideReasonLabel: "Reason"
        ).isEmpty)
}

@Test func recordListRulesNeverHideARecordSilently() {
    for status in RecordListStatus.allCases { #expect(RecordRules.showsStatusItem(status) == (status != .known)) }
    #expect(RecordRules.listName(label: "Immunisations", statusLabel: "Known") == "Immunisations")
    #expect(RecordRules.listName(label: nil, statusLabel: "None recorded") == "None recorded")
    #expect(RecordRules.listName(label: "", statusLabel: "None recorded") == "None recorded")
    #expect(RecordRules.showsContent(nil) && RecordRules.showsContent(.enteredInError) && !RecordRules.showsContent(.withheld))
    #expect(RecordRules.strikesContent(.enteredInError) && !RecordRules.strikesContent(.withheld) && !RecordRules.strikesContent(nil))
    #expect(RecordRules.listWarnings(statusLabel: nil).count == 1 && RecordRules.listWarnings(statusLabel: "Known").isEmpty)
    #expect(RecordRules.itemWarnings(status: "active", statusLabel: nil, entryState: .withheld, entryStateLabel: "").count == 2)
    #expect(RecordRules.itemWarnings(status: "", statusLabel: nil, entryState: nil, entryStateLabel: nil).isEmpty)
    #expect(
        RecordRules.itemWarnings(status: "active", statusLabel: "Active", entryState: .withheld, entryStateLabel: "Withheld")
            .isEmpty)
    #expect(RecordEntryState.allCases.map(\.rawValue) == ["withheld", "entered-in-error"])
    #expect(
        RecordRules.itemWarnings(status: nil, statusLabel: nil, entryState: .enteredInError, entryStateLabel: nil)
            == ["RecordListItem: entryState entered-in-error needs an entryStateLabel"])
}

@Test func ipsSectionsSayTheirStatusOnceAndWarnForMissingWords() {
    #expect(IpsRules.showsStatusLine(.omitted, placement: .heading))
    #expect(!IpsRules.showsStatusLine(.omitted, placement: .list))
    #expect(!IpsRules.showsStatusLine(.known, placement: .heading))
    #expect(
        IpsRules.sectionWarnings(
            heading: "", status: .noneKnown, statusLabel: nil, placement: .heading, hasNarrative: true, narrativeLabel: nil
        ).count == 3)
    #expect(
        IpsRules.sectionWarnings(
            heading: "Allergies", status: .noneKnown, statusLabel: nil, placement: .list, hasNarrative: false,
            narrativeLabel: nil
        ).isEmpty)
    #expect(
        IpsRules.sectionWarnings(
            heading: "Allergies", status: .noneKnown, statusLabel: "None", placement: .heading, hasNarrative: true,
            narrativeLabel: "Text"
        ).isEmpty)
    #expect(IpsRules.summaryWarnings(label: "", omittedLabel: "", requiredHeadings: [:]).count == 5)
    #expect(
        IpsRules.summaryWarnings(
            label: "Summary", omittedLabel: "Missing",
            requiredHeadings: ["medications": "M", "allergies": "A", "problems": "P"]
        ).isEmpty)
}

// HC-C17: a record list never says "none known" beside an entry.
@Test func noneKnownBesideAnEntrySaysTheConflict() {
    func shown(_ conflictLabel: String?, label: String? = nil, entries: Bool = true, noneKnown: Bool = true) -> RecordListShown {
        RecordListShown(
            isKnown: false, isNoneKnown: noneKnown, statusLabel: "No known allergies", conflictLabel: conflictLabel, label: label,
            hasEntries: entries)
    }
    #expect(shown("Check the source").item == "Check the source")
    #expect(shown("Check the source").name == "Check the source")
    #expect(shown("Check the source").entries)
    for blank in [nil, "", "   ", "\u{a0}"] as [String?] {
        #expect(shown(blank).item == nil)
        #expect(shown(blank).name == nil)
        #expect(shown(blank).entries)
        #expect(shown(blank).warnings("AllergyRecordList").count == 1)
    }
    #expect(shown("Check", label: "Allergies").name == "Allergies")
    #expect(shown("Check", label: "No known allergies").name == "Check")
    #expect(shown("Check", entries: false).item == "No known allergies")
    #expect(shown("Check", entries: false).warnings("AllergyRecordList").isEmpty)
    #expect(shown("Check", noneKnown: false).item == "No known allergies")
    #expect(!shown("Check", noneKnown: false).entries)
}

// HC-C17: a withdrawn entry does not contradict "none known".
@Test func aWithdrawnEntryIsNotAConflict() {
    #expect(AllergyRules.isWithdrawn(AllergyCodes(verificationStatus: "refuted")))
    #expect(AllergyRules.isWithdrawn(AllergyCodes(verificationStatus: "entered-in-error")))
    #expect(!AllergyRules.isWithdrawn(AllergyCodes(clinicalStatus: "resolved", verificationStatus: "confirmed")))
    #expect(RecordRules.isWithdrawn(status: nil, entryState: .enteredInError))
    #expect(RecordRules.isWithdrawn(status: "entered-in-error", entryState: nil))
    #expect(!RecordRules.isWithdrawn(status: "active", entryState: .withheld))
}
