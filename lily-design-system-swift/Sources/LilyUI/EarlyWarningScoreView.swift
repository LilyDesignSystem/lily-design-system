// EarlyWarningScoreView (components/early-warning-score-view): a score the app computed, its system, band and what to do.
// One VoiceOver element. The band key goes to the style for colour; its words are always shown and spoken.

import LilyCore
import SwiftUI

public protocol EarlyWarningScoreViewStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: EarlyWarningScoreViewStyleConfiguration) -> Body
}

public struct EarlyWarningScoreViewStyleConfiguration {
    public let system: Text?
    public let score: Text
    /// The app's band key, for the style's colour; never shown.
    public let band: String?
    public let bandLabel: Text?
    public let escalation: Text?
}

public struct PlainEarlyWarningScoreViewStyle: EarlyWarningScoreViewStyle {
    public init() {}
    public func makeBody(configuration: EarlyWarningScoreViewStyleConfiguration) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                configuration.system
                configuration.score.bold()
                configuration.bandLabel
            }
            configuration.escalation
        }
    }
}

extension EarlyWarningScoreViewStyle where Self == PlainEarlyWarningScoreViewStyle {
    public static var plain: PlainEarlyWarningScoreViewStyle { PlainEarlyWarningScoreViewStyle() }
}

extension EarlyWarningScoreViewStyle {
    @MainActor fileprivate func anyBody(_ configuration: EarlyWarningScoreViewStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct EarlyWarningScoreViewStyleKey: EnvironmentKey {
    static let defaultValue: any EarlyWarningScoreViewStyle = PlainEarlyWarningScoreViewStyle()
}

extension EnvironmentValues {
    public var earlyWarningScoreViewStyle: any EarlyWarningScoreViewStyle {
        get { self[EarlyWarningScoreViewStyleKey.self] }
        set { self[EarlyWarningScoreViewStyleKey.self] = newValue }
    }
}

extension View {
    public func earlyWarningScoreViewStyle(_ style: some EarlyWarningScoreViewStyle) -> some View {
        environment(\.earlyWarningScoreViewStyle, style)
    }
}

public struct EarlyWarningScoreView: View {
    let score: String
    let system: String?
    let band: String?
    let bandLabel: String?
    let escalation: String?
    let label: String?
    @Environment(\.earlyWarningScoreViewStyle) private var style

    /// - Parameters:
    ///   - score: the score the app's validated code computed.
    ///   - system: the scoring system's name ("NEWS2").
    ///   - band: the app's band key, for the style; `bandLabel` (its words) is required with it.
    ///   - escalation: what to do, in the app's words.
    ///   - label: spoken first, naming the value.
    public init(
        score: String, system: String? = nil, band: String? = nil, bandLabel: String? = nil, escalation: String? = nil,
        label: String? = nil
    ) {
        self.score = score
        self.system = system
        self.band = band
        self.bandLabel = bandLabel
        self.escalation = escalation
        self.label = label
        LilySemantics.warn(EarlyWarningScoreRules.warnings(band: band, bandLabel: bandLabel))
    }

    public var body: some View {
        style.anyBody(
            EarlyWarningScoreViewStyleConfiguration(
                system: system.map { Text(verbatim: $0) }, score: Text(verbatim: score), band: band,
                bandLabel: bandLabel.map { Text(verbatim: $0) }, escalation: escalation.map { Text(verbatim: $0) })
        )
        .accessibilityElement(children: .ignore)
        .accessibilityAddTraits(.isStaticText)
        .accessibilityLabel(
            Text(
                verbatim: EarlyWarningScoreRules.spoken(
                    label: label, system: system, score: score, bandLabel: bandLabel, escalation: escalation)))
    }
}
