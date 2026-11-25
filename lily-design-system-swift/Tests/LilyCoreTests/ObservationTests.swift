// One test per rule of observation-view (components/observation-view/AGENTS.md).

import Testing

@testable import LilyCore

// HC-C3
@Test func missingResultsShowTheirStatusWordsInsteadOfAValue() {
    let replacing: Set<ObservationStatus> = [.registered, .cancelled, .masked, .notRecorded, .unavailable, .notApplicable]
    for status in ObservationStatus.allCases {
        #expect(ObservationRules.statusReplacesValue(status) == replacing.contains(status), "\(status)")
    }
    #expect(ObservationRules.shownValue(value: "5.2", unit: "mmol/L", status: .masked) == nil)
    #expect(
        ObservationRules.spoken(
            label: "Potassium", value: "5.2", unit: "mmol/L", flagLabel: nil, interpretation: nil, range: nil,
            status: .unavailable, statusLabel: "Not available yet", previousLabel: nil) == "Potassium\nNot available yet")
}

@Test func everyStatusButFinalIsShown() {
    for status in ObservationStatus.allCases { #expect(ObservationRules.showsStatus(status) == (status != .final)) }
}

// HC-C2
@Test func onlyANonNormalCodeIsAFlagAndNothingIsInferred() {
    #expect(!ObservationRules.isFlagged(nil))
    #expect(!ObservationRules.isFlagged(""))
    #expect(!ObservationRules.isFlagged("N"))
    #expect(ObservationRules.isFlagged("H"))
    #expect(ObservationRules.isFlagged("LL"))
    // A range alone never makes a flag.
    #expect(
        ObservationRules.spoken(
            label: nil, value: "9", unit: nil, flagLabel: "High", interpretation: nil, range: "3.5 to 5.5",
            status: .final, statusLabel: nil, previousLabel: nil) == "9\n3.5 to 5.5")
}

// HC-F4
@Test func valueAndUnitAreJoinedByANoBreakSpace() {
    #expect(ObservationRules.shownValue(value: "5", unit: "mg", status: .final) == "5\u{00A0}mg")
    #expect(ObservationRules.shownValue(value: "5", unit: "", status: .final) == "5")
    #expect(ObservationRules.shownValue(value: "5", unit: nil, status: .final) == "5")
    #expect(ObservationRules.shownValue(value: "", unit: "mg", status: .final) == nil)
    #expect(ObservationRules.shownValue(value: nil, unit: "mg", status: .final) == nil)
}

@Test func spokenOrderIsLabelValueFlagRangesStatusPrevious() {
    #expect(
        ObservationRules.spoken(
            label: "Potassium", value: "6.1", unit: "mmol/L", flagLabel: "High", interpretation: "H",
            range: "3.5 to 5.5 mmol/L", ranges: [(label: "Critical", text: "above 6.5")], status: .amended,
            statusLabel: "Amended", previousLabel: "was 5.1 until 3 Nov")
            == "Potassium\n6.1\u{00A0}mmol/L\nHigh\n3.5 to 5.5 mmol/L\nCritical\u{00A0}above 6.5\nAmended\nwas 5.1 until 3 Nov")
}

@Test func warningsNameEveryMissingWord() {
    #expect(
        ObservationRules.warnings(
            interpretation: "H", flagLabel: nil, status: .preliminary, statusLabel: "", previousValue: "5.1",
            previousLabel: nil
        ).count == 3)
    #expect(
        ObservationRules.warnings(
            interpretation: "N", flagLabel: nil, status: .final, statusLabel: nil, previousValue: nil, previousLabel: nil
        ).isEmpty)
    #expect(
        ObservationRules.warnings(
            interpretation: "H", flagLabel: "High", status: .amended, statusLabel: "Amended", previousValue: "5.1",
            previousLabel: "was 5.1"
        ).isEmpty)
}

@Test func aNonFinalStatusWithNoWordsWarns() {
    #expect(
        ObservationRules.warnings(
            interpretation: nil, flagLabel: nil, status: .amended, statusLabel: nil, previousValue: nil, previousLabel: nil
        ) == ["ObservationView: status amended needs a statusLabel"])
}

// HC-C12, HC-C13, HC-C14 (spec/healthcare-ui/requirements.md): the audit of 2026-11-25, finding 2.
@Test func withheldAndWithdrawnResultsSpeakOnlyTheirWords() {
    func spoken(_ status: ObservationStatus, _ words: String?, _ show: Bool = false) -> String {
        ObservationRules.spoken(
            label: "Potassium", value: "5.9", unit: "mmol/L", flagLabel: "Critically high", interpretation: "HH", range: "3.5-5.3",
            ranges: [("Critical", "above 6.5")], status: status, statusLabel: words, previousLabel: "was 5.1", showWithdrawn: show)
    }
    for status in [ObservationStatus.masked, .registered, .notApplicable, .enteredInError] {
        #expect(spoken(status, "Words") == "Potassium\nWords")
    }
    #expect(spoken(.enteredInError, "Entered in error", true) == "Potassium\nEntered in error\n5.9\u{00A0}mmol/L")
    for status in ObservationStatus.allCases where status != .final {
        #expect(spoken(status, nil, true) == "Potassium")
    }
}
