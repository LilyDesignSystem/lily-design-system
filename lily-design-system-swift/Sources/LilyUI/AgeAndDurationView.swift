// AgeView and DurationView (components/age-view, components/duration-view): an age or a length of time in the app's words,
// with the machine-readable ISO 8601 duration beside it. Lily writes no unit words: format LilyCore's ageParts or
// durationParts with the platform (Duration.UnitsFormatStyle, DateComponentsFormatter) or the app's own labels. Each is one
// VoiceOver element, the optional label spoken first. Text views: style them with Text modifiers (font, colour).

import LilyCore
import SwiftUI

public struct AgeView: View {
    let value: String
    let duration: String?
    let label: String?

    /// - Parameters:
    ///   - value: the age as the app writes it ("5 years 2 months").
    ///   - duration: the same age as an ISO 8601 duration (`toIsoDuration(ageParts(…))`), for the app's own use.
    ///   - label: spoken first, naming the value ("Age").
    public init(_ value: String, duration: String? = nil, label: String? = nil) {
        self.value = value
        self.duration = duration
        self.label = label
    }

    public var body: some View {
        Text(verbatim: value)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(Text(verbatim: LilySemantics.spoken(label, value) ?? value))
    }
}

public struct DurationView: View {
    let value: String
    let duration: String
    let label: String?

    /// - Parameters:
    ///   - value: the length of time as the app writes it ("3 days early"); the direction is in these words.
    ///   - duration: the same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative.
    ///   - label: spoken first, naming the value.
    public init(_ value: String, duration: String, label: String? = nil) {
        self.value = value
        self.duration = duration
        self.label = label
        LilySemantics.warn(Self.warnings(duration))
    }

    /// The parsed duration, as the web renders `datetime` and `data-negative`; nil when it is not a valid day-time duration.
    public var parsed: (datetime: String, negative: Bool)? { htmlDuration(duration) }

    static func warnings(_ duration: String) -> [String] {
        htmlDuration(duration) == nil
            ? ["DurationView: \(duration) is not an ISO 8601 duration of days, hours, minutes and seconds"] : []
    }

    public var body: some View {
        Text(verbatim: value)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(Text(verbatim: LilySemantics.spoken(label, value) ?? value))
    }
}
