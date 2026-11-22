// LilyAlert (components/alert): a message with a severity. Named LilyAlert because SwiftUI has an `Alert` type
// (mobile/components-mobile.tsv). An assertive or polite alert is announced when it appears and when its message changes
// (the mobile form of role="alert" / role="status"); the severity is exposed to the style, never spoken by Lily: say it in the
// heading or message if it matters.

import SwiftUI

public enum AlertKind: String, Sendable, CaseIterable {
    case info, success, warning, error
}

public protocol LilyAlertStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: LilyAlertStyleConfiguration) -> Body
}

public struct LilyAlertStyleConfiguration {
    /// The severity, for colour and icon choices (the web's `data-type`). Never the only cue: the text says it.
    public let kind: AlertKind
    public let heading: Text?
    public let message: Text
}

public struct PlainLilyAlertStyle: LilyAlertStyle {
    public init() {}
    public func makeBody(configuration: LilyAlertStyleConfiguration) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            configuration.heading?.bold()
            configuration.message
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

extension LilyAlertStyle where Self == PlainLilyAlertStyle {
    public static var plain: PlainLilyAlertStyle { PlainLilyAlertStyle() }
}

extension LilyAlertStyle {
    @MainActor fileprivate func anyBody(_ configuration: LilyAlertStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct LilyAlertStyleKey: EnvironmentKey {
    static let defaultValue: any LilyAlertStyle = PlainLilyAlertStyle()
}

extension EnvironmentValues {
    public var lilyAlertStyle: any LilyAlertStyle {
        get { self[LilyAlertStyleKey.self] }
        set { self[LilyAlertStyleKey.self] = newValue }
    }
}

extension View {
    public func lilyAlertStyle(_ style: some LilyAlertStyle) -> some View {
        environment(\.lilyAlertStyle, style)
    }
}

public struct LilyAlert: View {
    private let kind: AlertKind
    private let heading: String?
    private let message: String
    private let politeness: Politeness
    @Environment(\.lilyAlertStyle) private var style

    /// - Parameters:
    ///   - kind: the severity, for the style.
    ///   - heading: an optional heading, in the consumer's language.
    ///   - message: the message, in the consumer's language.
    ///   - politeness: `.assertive` (the default, as `role="alert"`), `.polite` (`role="status"`) or `.off`.
    public init(kind: AlertKind = .info, heading: String? = nil, message: String, politeness: Politeness = .assertive) {
        self.kind = kind
        self.heading = heading
        self.message = message
        self.politeness = politeness
    }

    public var body: some View {
        style.anyBody(
            LilyAlertStyleConfiguration(
                kind: kind, heading: heading.map { Text(verbatim: $0) }, message: Text(verbatim: message))
        )
        .accessibilityElement(children: .ignore)
        .accessibilityAddTraits(.isStaticText)
        .accessibilityLabel(Text(verbatim: LilySemantics.spoken(heading, message) ?? ""))
        .onAppear(perform: announce)
        .onChange(of: message, messageChanged)
    }

    func messageChanged(from _: String, to _: String) { announce() }

    func announce() {
        LilySemantics.announce(LilySemantics.announcement(heading: heading, message: message, politeness: politeness))
    }
}
