// The rules of allergy-record-list and allergy-record-list-item (components/allergy-record-list*), shared by both mobile
// platforms. A list is never blank: any status but known makes its status words the one item. Every coded field (severity,
// criticality, clinical status, verification status) is shown in the app's words, never as a colour or a code, and a
// relative's record says whose it is first.

public enum AllergyListStatus: String, Sendable, CaseIterable {
    case known, unavailable, omitted
    case noneKnown = "none-known"
    case notRecorded = "not-recorded"
    case notApplicable = "not-applicable"
}

/// The FHIR AllergyIntolerance codes an item takes; each is shown only through its label.
public struct AllergyCodes: Sendable, Equatable {
    public var severity: String?
    public var criticality: String?
    public var clinicalStatus: String?
    public var verificationStatus: String?
    public init(severity: String? = nil, criticality: String? = nil, clinicalStatus: String? = nil, verificationStatus: String? = nil) {
        self.severity = severity
        self.criticality = criticality
        self.clinicalStatus = clinicalStatus
        self.verificationStatus = verificationStatus
    }
}

/// The words for an item, in the order they are shown and spoken.
public struct AllergyWords: Sendable, Equatable {
    public var subject: String?
    public var substance: String
    public var reaction: String?
    public var severity: String?
    public var criticality: String?
    public var clinicalStatus: String?
    public var verificationStatus: String?
    public var type: String?
    public var category: String?
    public var updated: String?
    public init(
        subject: String? = nil, substance: String, reaction: String? = nil, severity: String? = nil, criticality: String? = nil,
        clinicalStatus: String? = nil, verificationStatus: String? = nil, type: String? = nil, category: String? = nil,
        updated: String? = nil
    ) {
        self.subject = subject
        self.substance = substance
        self.reaction = reaction
        self.severity = severity
        self.criticality = criticality
        self.clinicalStatus = clinicalStatus
        self.verificationStatus = verificationStatus
        self.type = type
        self.category = category
        self.updated = updated
    }
}

public enum AllergyRules {
    /// Any status but known shows the status words as the list's one item.
    public static func showsStatusItem(_ status: AllergyListStatus) -> Bool { status != .known }

    /// The list's accessible name: the label, else the status words.
    public static func listName(label: String?, statusLabel: String) -> String {
        if let label, !label.isEmpty { return label }
        return statusLabel
    }

    public static func listWarnings(statusLabel: String?) -> [String] {
        statusLabel?.isEmpty ?? true ? ["AllergyRecordList: a statusLabel is required, so the list is never blank"] : []
    }

    /// A warning for each code given without its words.
    public static func itemWarnings(codes: AllergyCodes, words: AllergyWords) -> [String] {
        let pairs: [(String, String?, String?)] = [
            ("severity", codes.severity, words.severity), ("criticality", codes.criticality, words.criticality),
            ("clinicalStatus", codes.clinicalStatus, words.clinicalStatus),
            ("verificationStatus", codes.verificationStatus, words.verificationStatus),
        ]
        return pairs.compactMap { name, code, label in
            guard let code, label?.isEmpty ?? true else { return nil }
            return "AllergyRecordListItem: \(name) \(code) needs its label, or it is shown as a code or a colour"
        }
    }

    /// Everything an item says, in order, joined by line breaks; Lily adds no words.
    public static func spoken(_ words: AllergyWords) -> String {
        [
            words.subject, words.substance, words.reaction, words.severity, words.criticality, words.clinicalStatus,
            words.verificationStatus, words.type, words.category, words.updated,
        ].compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: "\n")
    }
}
