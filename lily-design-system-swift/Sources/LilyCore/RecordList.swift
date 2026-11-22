// The rules of record-list and record-list-item (components/record-list*), the shape every clinical list shares. A list is
// never blank; a withheld record shows only its state words, never its content; a record entered in error keeps its content,
// struck through, with its state words; neither is silently removed (spec/lessons/zoblocks). Whose record it is comes first.

public enum RecordListStatus: String, Sendable, CaseIterable {
    case known, unavailable, omitted
    case noneKnown = "none-known"
    case notRecorded = "not-recorded"
    case notApplicable = "not-applicable"
}

public enum RecordEntryState: String, Sendable, CaseIterable {
    case withheld
    case enteredInError = "entered-in-error"
}

public enum RecordRules {
    public static func showsStatusItem(_ status: RecordListStatus) -> Bool { status != .known }

    public static func listName(label: String?, statusLabel: String) -> String {
        if let label, !label.isEmpty { return label }
        return statusLabel
    }

    /// Whether the record's content is shown: never for a withheld record.
    public static func showsContent(_ entryState: RecordEntryState?) -> Bool { entryState != .withheld }

    /// Whether the content is struck through: a record entered in error.
    public static func strikesContent(_ entryState: RecordEntryState?) -> Bool { entryState == .enteredInError }

    public static func listWarnings(statusLabel: String?) -> [String] {
        statusLabel?.isEmpty ?? true ? ["RecordList: a statusLabel is required, so the list is never blank"] : []
    }

    public static func itemWarnings(
        status: String?, statusLabel: String?, entryState: RecordEntryState?, entryStateLabel: String?
    ) -> [String] {
        var out: [String] = []
        if let status, !status.isEmpty, statusLabel?.isEmpty ?? true {
            out.append("RecordListItem: status \(status) needs a statusLabel, or it is shown as a code or a colour")
        }
        if let entryState, entryStateLabel?.isEmpty ?? true {
            out.append("RecordListItem: entryState \(entryState.rawValue) needs an entryStateLabel")
        }
        return out
    }
}
