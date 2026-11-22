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
