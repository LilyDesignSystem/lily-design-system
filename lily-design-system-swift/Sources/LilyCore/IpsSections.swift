// The Swift port of shared/ips-sections.ts, proved equal by shared/vectors/ips-sections.json. The sixteen sections of the
// HL7 FHIR IPS Composition (IPS 2.0.1) with their LOINC codes and levels; a summary shows a missing required section rather
// than hiding it. No FHIR parsing, no words: headings and status words are the app's.

public enum IpsSectionStatus: String, Sendable, CaseIterable {
    case known, unavailable, omitted
    case noneKnown = "none-known"
    case notRecorded = "not-recorded"
}

public enum IpsSectionLevel: String, Sendable {
    case required, recommended, optional
}

public struct IpsSectionDefinition: Sendable, Equatable {
    public let key: String
    /// The section's LOINC code in the IPS Composition.
    public let code: String
    public let level: IpsSectionLevel
}

/// One section the app renders, as plain data.
public struct IpsSectionEntry: Sendable, Equatable {
    public var key: String
    public var heading: String
    public var status: IpsSectionStatus?
    public var id: String?
    public init(key: String, heading: String, status: IpsSectionStatus? = nil, id: String? = nil) {
        self.key = key
        self.heading = heading
        self.status = status
        self.id = id
    }
}

public struct IpsContentsEntry: Sendable, Equatable {
    public let key: String
    public let heading: String
    public let status: IpsSectionStatus
    public let id: String
    public let code: String?
    public let required: Bool
    /// True when the summary added it because the app's list lacked a required section.
    public let added: Bool
}

/// The IPS 2.0.1 Composition sections, in the IG's order.
public let ipsSections: [IpsSectionDefinition] = [
    .init(key: "medications", code: "10160-0", level: .required),
    .init(key: "allergies", code: "48765-2", level: .required),
    .init(key: "problems", code: "11450-4", level: .required),
    .init(key: "immunizations", code: "11369-6", level: .recommended),
    .init(key: "results", code: "30954-2", level: .recommended),
    .init(key: "procedures", code: "47519-4", level: .recommended),
    .init(key: "devices", code: "46264-8", level: .recommended),
    .init(key: "vital-signs", code: "8716-3", level: .optional),
    .init(key: "past-illness", code: "11348-0", level: .optional),
    .init(key: "functional-status", code: "47420-5", level: .optional),
    .init(key: "plan-of-care", code: "18776-5", level: .optional),
    .init(key: "social-history", code: "29762-2", level: .optional),
    .init(key: "pregnancy", code: "10162-6", level: .optional),
    .init(key: "advance-directives", code: "42348-3", level: .optional),
    .init(key: "alerts", code: "104605-1", level: .optional),
    .init(key: "patient-story", code: "81338-6", level: .optional),
]

/// The keys of the three required sections, in registry order.
public let ipsRequiredSections: [String] = ipsSections.filter { $0.level == .required }.map(\.key)

/// The default id prefix; give each summary on a screen its own.
public let ipsIdPrefix = "international-patient-summary"

public func ipsSectionCode(_ key: String) -> String? { ipsSections.first { $0.key == key }?.code }

public func ipsSectionIsRequired(_ key: String) -> Bool { ipsRequiredSections.contains(key) }

public func ipsSectionId(_ key: String, id: String? = nil, idPrefix: String = ipsIdPrefix) -> String {
    if let id, !id.isEmpty { return id }
    return "\(idPrefix.isEmpty ? ipsIdPrefix : idPrefix)-\(key)"
}

/// The required section keys the app's list lacks, in registry order.
public func ipsMissingRequired(_ keys: [String]) -> [String] {
    let present = Set(keys)
    return ipsRequiredSections.filter { !present.contains($0) }
}

/// The contents in the app's order, then an "omitted" entry for each missing required section, headed by the app's words.
public func ipsContents(
    _ sections: [IpsSectionEntry], requiredHeadings: [String: String], idPrefix: String = ipsIdPrefix
) -> [IpsContentsEntry] {
    let given = sections.map {
        IpsContentsEntry(
            key: $0.key, heading: $0.heading, status: $0.status ?? .known,
            id: ipsSectionId($0.key, id: $0.id, idPrefix: idPrefix), code: ipsSectionCode($0.key),
            required: ipsSectionIsRequired($0.key), added: false)
    }
    let added = ipsMissingRequired(sections.map(\.key)).map {
        IpsContentsEntry(
            key: $0, heading: requiredHeadings[$0] ?? "", status: .omitted, id: ipsSectionId($0, idPrefix: idPrefix),
            code: ipsSectionCode($0), required: true, added: true)
    }
    return given + added
}
