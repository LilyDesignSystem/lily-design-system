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
