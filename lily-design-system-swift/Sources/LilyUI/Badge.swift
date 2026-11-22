// Badge (components/badge): a short status. On the web it is role="status", a polite live region, so a change of its text is
// announced; here a change is announced politely. `label` replaces the spoken text when the visible text needs context.
// The kind goes to the style (the web's data-type), never spoken.

import SwiftUI

public enum BadgeKind: String, Sendable, CaseIterable {
    case `default`, info, success, warning, error
}

public protocol BadgeStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: BadgeStyleConfiguration) -> Body
}

public struct BadgeStyleConfiguration {
    public let kind: BadgeKind
    public let text: Text
}

public struct PlainBadgeStyle: BadgeStyle {
    public init() {}
    public func makeBody(configuration: BadgeStyleConfiguration) -> some View {
        configuration.text.font(.caption.bold())
    }
}

extension BadgeStyle where Self == PlainBadgeStyle {
    public static var plain: PlainBadgeStyle { PlainBadgeStyle() }
}

extension BadgeStyle {
    @MainActor fileprivate func anyBody(_ configuration: BadgeStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct BadgeStyleKey: EnvironmentKey {
    static let defaultValue: any BadgeStyle = PlainBadgeStyle()
}

extension EnvironmentValues {
    public var badgeStyle: any BadgeStyle {
        get { self[BadgeStyleKey.self] }
        set { self[BadgeStyleKey.self] = newValue }
    }
}

extension View {
    public func badgeStyle(_ style: some BadgeStyle) -> some View {
        environment(\.badgeStyle, style)
    }
}

public struct Badge: View {
    private let text: String
    private let kind: BadgeKind
    private let label: String?
    @Environment(\.badgeStyle) private var style

    /// - Parameters:
    ///   - text: the visible text ("3", "New"), in the app's language.
    ///   - kind: the variant, for the style.
    ///   - label: spoken instead of the text when the text alone lacks context ("3 unread messages").
    public init(_ text: String, kind: BadgeKind = .default, label: String? = nil) {
        self.text = text
        self.kind = kind
        self.label = label
    }

    public var body: some View {
        style.anyBody(BadgeStyleConfiguration(kind: kind, text: Text(verbatim: text)))
            .accessibilityElement(children: .ignore)
            .accessibilityAddTraits(.isStaticText)
            .accessibilityLabel(Text(verbatim: LilySemantics.badgeLabel(text: text, label: label)))
            .onChange(of: text, textChanged)
    }

    func textChanged(from _: String, to newText: String) {
        LilySemantics.announce(
            LilySemantics.announcement(
                heading: nil, message: LilySemantics.badgeLabel(text: newText, label: label), politeness: .polite))
    }
}
