// The rules of observation-view (components/observation-view), pure so both mobile platforms share them and they are tested
// without a UI. They decide what is shown and spoken, never what a result means: no interpretation is ever inferred from a
// range, and the flag is always the consumer's words, so its meaning is never colour alone.

/// A FHIR Observation status, or one of Lily's absences (spec/lessons/openehr, spec/lessons/openmrs).
public enum ObservationStatus: String, Sendable, CaseIterable {
    case final, preliminary, amended, corrected, cancelled, masked, unavailable
    case enteredInError = "entered-in-error"
    case notRecorded = "not-recorded"
    case notApplicable = "not-applicable"
}

public enum ObservationRules {
    /// A missing result shows its status words instead of a value, so it is never blank or a dash.
    public static func statusReplacesValue(_ status: ObservationStatus) -> Bool {
        switch status {
        case .cancelled, .masked, .notRecorded, .unavailable: true
        default: false
        }
    }

    /// Any status but final is shown, beside the value or instead of it, so an amended result never reads as a plain one.
    public static func showsStatus(_ status: ObservationStatus) -> Bool { status != .final }

    /// Whether a FHIR v3 ObservationInterpretation code is a flag (anything but normal). No code is never a flag.
    public static func isFlagged(_ interpretation: String?) -> Bool {
        guard let interpretation, !interpretation.isEmpty else { return false }
        return interpretation != "N"
    }

    /// The development warnings for a set of props, in English for the developer (never shown to the user).
    public static func warnings(
        interpretation: String?, flagLabel: String?, status: ObservationStatus, statusLabel: String?,
        previousValue: String?, previousLabel: String?
    ) -> [String] {
        var out: [String] = []
        if isFlagged(interpretation), flagLabel?.isEmpty ?? true {
            out.append("ObservationView: interpretation \(interpretation!) needs a flagLabel, or the flag is colour alone")
        }
        if showsStatus(status), statusLabel?.isEmpty ?? true {
            out.append("ObservationView: status \(status.rawValue) needs a statusLabel")
        }
        if previousValue != nil, previousLabel?.isEmpty ?? true {
            out.append("ObservationView: previousValue needs a previousLabel, since the change may not be announced")
        }
        return out
    }

    /// The value and unit joined by a no-break space, so a dose never wraps from its unit; nil when the status replaces it.
    public static func shownValue(value: String?, unit: String?, status: ObservationStatus) -> String? {
        if statusReplacesValue(status) { return nil }
        guard let value, !value.isEmpty else { return nil }
        guard let unit, !unit.isEmpty else { return value }
        return value + "\u{00A0}" + unit
    }

    /// Everything spoken, in reading order: the label, the value (or the status replacing it), the flag, the ranges, the
    /// status beside the value, then the previous value's words. Pieces are joined by line breaks; Lily adds no words.
    public static func spoken(
        label: String?, value: String?, unit: String?, flagLabel: String?, interpretation: String?, range: String?,
        ranges: [(label: String, text: String)] = [], status: ObservationStatus, statusLabel: String?, previousLabel: String?
    ) -> String {
        var pieces: [String?] = [label]
        if statusReplacesValue(status) {
            pieces.append(statusLabel)
        } else {
            pieces.append(shownValue(value: value, unit: unit, status: status))
        }
        if isFlagged(interpretation) { pieces.append(flagLabel) }
        pieces.append(range)
        for named in ranges { pieces.append(named.label + "\u{00A0}" + named.text) }
        if showsStatus(status), !statusReplacesValue(status) { pieces.append(statusLabel) }
        pieces.append(previousLabel)
        return pieces.compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: "\n")
    }
}
