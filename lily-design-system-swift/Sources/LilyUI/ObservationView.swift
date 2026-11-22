// ObservationView (components/observation-view): a clinical result with its unit, flag, reference range, status and an
// optional meter. The rules are LilyCore's ObservationRules; the view is one VoiceOver element that speaks them in order. The
// meter (a Gauge) is the picture of the words and hidden from VoiceOver; the flag's meaning is in its words, never its colour.

import LilyCore
import SwiftUI

public protocol ObservationViewStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: ObservationViewStyleConfiguration) -> Body
}

public struct ObservationViewStyleConfiguration {
    /// The value and unit, or the status words that replace a missing result.
    public let value: Text?
    /// The flag in the consumer's words, when the result is flagged.
    public let flag: Text?
    /// The FHIR interpretation code, for the style's colour; never shown as text.
    public let interpretation: String?
    public let range: Text?
    public let ranges: [(label: Text, text: Text)]
    /// The status words shown beside the value, for a status other than final.
    public let status: Text?
    public let observationStatus: ObservationStatus
    /// The superseded value, struck through, and its words.
    public let previousValue: Text?
    public let previousLabel: Text?
    /// The meter, already hidden from VoiceOver; nil when no scale was given or the result is missing.
    public let meter: AnyView?
}

public struct PlainObservationViewStyle: ObservationViewStyle {
    public init() {}
    public func makeBody(configuration: ObservationViewStyleConfiguration) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                configuration.value?.bold()
                configuration.flag
                configuration.status
            }
            if let previous = configuration.previousValue {
                HStack(spacing: 8) {
                    previous.strikethrough()
                    configuration.previousLabel
                }
            }
            configuration.range?.font(.footnote)
            ForEach(Array(configuration.ranges.enumerated()), id: \.offset) { _, named in
                HStack(spacing: 4) { named.label; named.text }.font(.footnote)
            }
            configuration.meter
        }
    }
}

extension ObservationViewStyle where Self == PlainObservationViewStyle {
    public static var plain: PlainObservationViewStyle { PlainObservationViewStyle() }
}

extension ObservationViewStyle {
    @MainActor fileprivate func anyBody(_ configuration: ObservationViewStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct ObservationViewStyleKey: EnvironmentKey {
    static let defaultValue: any ObservationViewStyle = PlainObservationViewStyle()
}

extension EnvironmentValues {
    public var observationViewStyle: any ObservationViewStyle {
        get { self[ObservationViewStyleKey.self] }
        set { self[ObservationViewStyleKey.self] = newValue }
    }
}

extension View {
    public func observationViewStyle(_ style: some ObservationViewStyle) -> some View {
        environment(\.observationViewStyle, style)
    }
}

public struct ObservationView: View {
    /// A further named reference range ("Critical", "below 2.5").
    public struct NamedRange: Sendable {
        public let label: String
        public let text: String
        public init(label: String, text: String) {
            self.label = label
            self.text = text
        }
    }

    let value: String?
    let unit: String?
    let interpretation: String?
    let flagLabel: String?
    let range: String?
    let ranges: [NamedRange]
    let status: ObservationStatus
    let statusLabel: String?
    let previousValue: String?
    let previousLabel: String?
    let label: String?
    let meterValue: Double?
    let meter: MeterScale?
    @Environment(\.observationViewStyle) private var style

    /// - Parameters:
    ///   - value: the value, formatted by the app ("5.2").
    ///   - unit: the unit ("mmol/L"); joined to the value by a no-break space.
    ///   - interpretation: a FHIR v3 ObservationInterpretation code ("N", "H", "LL"); for the style only, never shown.
    ///   - flagLabel: the flag in the app's words ("High"); required when the interpretation is not "N".
    ///   - range, ranges: the reference range, and further named ranges, as text.
    ///   - status: a FHIR status or a Lily absence; default `.final`.
    ///   - statusLabel: the status in words; required for any status but final, and shown instead of a missing value.
    ///   - previousValue, previousLabel: a superseded value and the words for it ("was 5.1 until 3 Nov").
    ///   - label: spoken first, when no visible caption names the observation.
    ///   - meterValue, meter: the value as a number and its scale (`meterScale` in LilyCore) for a hidden Gauge.
    public init(
        value: String? = nil, unit: String? = nil, interpretation: String? = nil, flagLabel: String? = nil,
        range: String? = nil, ranges: [NamedRange] = [], status: ObservationStatus = .final, statusLabel: String? = nil,
        previousValue: String? = nil, previousLabel: String? = nil, label: String? = nil, meterValue: Double? = nil,
        meter: MeterScale? = nil
    ) {
        self.value = value
        self.unit = unit
        self.interpretation = interpretation
        self.flagLabel = flagLabel
        self.range = range
        self.ranges = ranges
        self.status = status
        self.statusLabel = statusLabel
        self.previousValue = previousValue
        self.previousLabel = previousLabel
        self.label = label
        self.meterValue = meterValue
        self.meter = meter
        LilySemantics.warn(
            ObservationRules.warnings(
                interpretation: interpretation, flagLabel: flagLabel, status: status, statusLabel: statusLabel,
                previousValue: previousValue, previousLabel: previousLabel))
    }

    var spoken: String {
        ObservationRules.spoken(
            label: label, value: value, unit: unit, flagLabel: flagLabel, interpretation: interpretation, range: range,
            ranges: ranges.map { ($0.label, $0.text) }, status: status, statusLabel: statusLabel, previousLabel: previousLabel)
    }

    public var body: some View {
        let replaced = ObservationRules.statusReplacesValue(status)
        let shown = replaced ? statusLabel : ObservationRules.shownValue(value: value, unit: unit, status: status)
        style.anyBody(
            ObservationViewStyleConfiguration(
                value: shown.map { Text(verbatim: $0) },
                flag: ObservationRules.isFlagged(interpretation) ? flagLabel.map { Text(verbatim: $0) } : nil,
                interpretation: interpretation,
                range: range.map { Text(verbatim: $0) },
                ranges: ranges.map { (Text(verbatim: $0.label), Text(verbatim: $0.text)) },
                status: ObservationRules.showsStatus(status) && !replaced ? statusLabel.map { Text(verbatim: $0) } : nil,
                observationStatus: status,
                previousValue: previousValue.map { Text(verbatim: $0) },
                previousLabel: previousLabel.map { Text(verbatim: $0) },
                meter: meterView(replaced: replaced)))
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(Text(verbatim: spoken))
    }

    private func meterView(replaced: Bool) -> AnyView? {
        guard !replaced, let meterValue, let meter else { return nil }
        return AnyView(
            Gauge(value: min(max(meterValue, meter.min), meter.max), in: meter.min...meter.max) { EmptyView() }
                .accessibilityHidden(true))
    }
}
