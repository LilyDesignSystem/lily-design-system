// WarningText (components/warning-text): a warning the user must not miss, with an optional decorative icon.
// On the web the kind of message ("Warning") is visually hidden text; iOS has no visually hidden text, so it is a required
// `prefix`, spoken as the element's label, with the warning as its value. Lily supplies neither word.

import SwiftUI

public protocol WarningTextStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: WarningTextStyleConfiguration) -> Body
}

public struct WarningTextStyleConfiguration {
    /// The consumer's decorative icon, already hidden from accessibility; `nil` when none was given.
    public let icon: AnyView?
    /// The warning text.
    public let message: Text
    /// The spoken prefix, for styles that also show it.
    public let prefix: String
}

/// Draws only what the platform draws: the icon, then the text in bold.
public struct PlainWarningTextStyle: WarningTextStyle {
    public init() {}
    public func makeBody(configuration: WarningTextStyleConfiguration) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 8) {
            configuration.icon
            configuration.message.bold()
        }
    }
}

extension WarningTextStyle where Self == PlainWarningTextStyle {
    public static var plain: PlainWarningTextStyle { PlainWarningTextStyle() }
}

extension WarningTextStyle {
    @MainActor fileprivate func anyBody(_ configuration: WarningTextStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct WarningTextStyleKey: EnvironmentKey {
    static let defaultValue: any WarningTextStyle = PlainWarningTextStyle()
}

extension EnvironmentValues {
    public var warningTextStyle: any WarningTextStyle {
        get { self[WarningTextStyleKey.self] }
        set { self[WarningTextStyleKey.self] = newValue }
    }
}

extension View {
    /// Sets the style of every `WarningText` inside this view.
    public func warningTextStyle(_ style: some WarningTextStyle) -> some View {
        environment(\.warningTextStyle, style)
    }
}

public struct WarningText<Icon: View>: View {
    private let prefix: String
    private let text: String
    private let icon: Icon?
    @Environment(\.warningTextStyle) private var style

    /// - Parameters:
    ///   - prefix: the kind of message, spoken first ("Warning"), in the consumer's language. Required.
    ///   - text: the warning, in the consumer's language.
    ///   - icon: a decorative icon; hidden from VoiceOver.
    public init(prefix: String, text: String, @ViewBuilder icon: () -> Icon) {
        self.prefix = prefix
        self.text = text
        self.icon = icon()
    }

    public var body: some View {
        style.anyBody(
            WarningTextStyleConfiguration(
                icon: icon.map { AnyView($0.accessibilityHidden(true)) }, message: Text(verbatim: text), prefix: prefix)
        )
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(verbatim: prefix))
        .accessibilityValue(Text(verbatim: text))
    }
}

extension WarningText where Icon == EmptyView {
    public init(prefix: String, text: String) {
        self.prefix = prefix
        self.text = text
        self.icon = nil
    }
}
