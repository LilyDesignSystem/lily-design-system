// What a record list says about itself, and whether that can be true (HC-C17; shared/record-list-state.ts is the web's twin).
// "None known" beside an entry is a contradiction, and either half of it may be the wrong one. So the entry stays, the words
// "none known" go, and the app's own words for the conflict take their place, as the list's item and its name.

public struct RecordListShown: Sendable, Equatable {
    /// The list's name; nil when nothing true can be said.
    public let name: String?
    /// The words of the list's status item, or nil when there is none.
    public let item: String?
    /// Whether the entries are shown.
    public let entries: Bool
    public let conflict: Bool

    public init(
        isKnown: Bool, isNoneKnown: Bool, statusLabel: String, conflictLabel: String?, label: String?, hasEntries: Bool
    ) {
        conflict = isNoneKnown && hasEntries
        let words: String? = conflict ? (hasWords(conflictLabel) ? conflictLabel : nil) : statusLabel
        item = isKnown ? nil : words
        entries = isKnown || isNoneKnown
        // A label that only repeats the status is the status, so it goes with it.
        if let label, !label.isEmpty, !(conflict && label == statusLabel) { name = label } else { name = words }
    }

    public func warnings(_ list: String) -> [String] {
        conflict && item == nil
            ? ["\(list): it says none are known and holds an entry; give a conflictLabel, your words for that"] : []
    }
}

extension RecordRules {
    /// An entry someone has withdrawn does not contradict "none known".
    public static func isWithdrawn(status: String?, entryState: RecordEntryState?) -> Bool {
        entryState == .enteredInError || status == "entered-in-error"
    }
}

extension AllergyRules {
    public static func isWithdrawn(_ codes: AllergyCodes) -> Bool {
        codes.verificationStatus == "refuted" || codes.verificationStatus == "entered-in-error"
    }
}
