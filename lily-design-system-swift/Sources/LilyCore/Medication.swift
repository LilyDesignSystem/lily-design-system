// The rules of medication-view (components/medication-view), shared by both mobile platforms. Tall man letters come from
// the app as marked segments; nothing is marked automatically. The spoken name is the segments joined, so a screen reader
// says one word ("hydroxyzine"), not letters; no part is ever truncated.

/// One part of a medication name; `tallMan` parts are emphasised ("hydr" + "OXY" + "zine").
public struct MedicationNameSegment: Sendable, Equatable {
    public var text: String
    public var tallMan: Bool
    public init(_ text: String, tallMan: Bool = false) {
        self.text = text
        self.tallMan = tallMan
    }
}

public enum MedicationRules {
    /// The name as plain text: the segments joined when given, else the name.
    public static func name(_ name: String?, segments: [MedicationNameSegment]) -> String? {
        if !segments.isEmpty { return segments.map(\.text).joined() }
        return name
    }

    /// Everything spoken, in order: label, name, strength, form, route, frequency, then free-text dosage.
    public static func spoken(
        label: String?, name: String?, segments: [MedicationNameSegment], strength: String?, form: String?, route: String?,
        frequency: String?, dosageText: String?
    ) -> String {
        [label, Self.name(name, segments: segments), strength, form, route, frequency, dosageText]
            .compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: "\n")
    }
}
