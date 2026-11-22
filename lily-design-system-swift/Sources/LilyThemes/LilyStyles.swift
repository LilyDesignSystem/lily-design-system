// The themed `.lily` styles: LilyUI's components drawn with a theme's tokens. They live here, not in LilyUI, as the web keeps
// themes out of the headless layer. Text uses only the pairs the web gates at 4.5:1 (a fill with its own `-content`, base
// text on the base surfaces); a severity colour is a rail or a border, never text (AGENTS/theme.md, colour pairs).

import LilyUI
import SwiftUI

private struct LilyTokensKey: EnvironmentKey {
    static let defaultValue = LilyTokens.light
}

extension EnvironmentValues {
    /// The tokens the `.lily` styles read; `.light` unless an ancestor sets another with `.lilyTheme(_:)`.
    public var lilyTokens: LilyTokens {
        get { self[LilyTokensKey.self] }
        set { self[LilyTokensKey.self] = newValue }
    }
}

extension View {
    /// Draws every LilyUI component inside this view with `tokens`. Light and dark are the app's choice: pass `.dark` when
    /// `colorScheme` is dark, for example.
    public func lilyTheme(_ tokens: LilyTokens) -> some View {
        self
            .environment(\.lilyTokens, tokens)
            .lilyAlertStyle(LilyThemedAlertStyle())
            .badgeStyle(LilyThemedBadgeStyle())
            .tagStyle(LilyThemedTagStyle())
            .cardStyle(LilyThemedCardStyle())
            .insetTextStyle(LilyThemedInsetTextStyle())
            .warningTextStyle(LilyThemedWarningTextStyle())
            .summaryListItemStyle(LilyThemedSummaryListItemStyle())
    }
}

extension LilyTokens {
    /// The fill for a severity, and the text colour that pairs with it.
    func pair(for kind: AlertKind) -> (fill: Color, text: Color) {
        switch kind {
        case .info: (info, infoContent)
        case .success: (success, successContent)
        case .warning: (warning, warningContent)
        case .error: (error, errorContent)
        }
    }

    func pair(for kind: BadgeKind) -> (fill: Color, text: Color) {
        switch kind {
        case .default: (neutral, neutralContent)
        case .info: (info, infoContent)
        case .success: (success, successContent)
        case .warning: (warning, warningContent)
        case .error: (error, errorContent)
        }
    }
}

/// An alert on the base surface with a rail in its severity's colour; the text stays base content.
public struct LilyThemedAlertStyle: LilyAlertStyle {
    public init() {}
    public func makeBody(configuration: LilyAlertStyleConfiguration) -> some View {
        Themed { tokens in
            HStack(spacing: 0) {
                Rectangle().fill(tokens.pair(for: configuration.kind).fill).frame(width: 4)
                VStack(alignment: .leading, spacing: 4) {
                    configuration.heading?.bold()
                    configuration.message
                }
                .padding(12)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .foregroundStyle(tokens.baseContent)
            .background(tokens.base100)
            .clipShape(RoundedRectangle(cornerRadius: tokens.radiusBox))
            .overlay(
                RoundedRectangle(cornerRadius: tokens.radiusBox)
                    .strokeBorder(tokens.pair(for: configuration.kind).fill, lineWidth: tokens.borderBorder))
        }
    }
}

/// A badge filled with its kind's colour and that colour's own text colour.
public struct LilyThemedBadgeStyle: BadgeStyle {
    public init() {}
    public func makeBody(configuration: BadgeStyleConfiguration) -> some View {
        Themed { tokens in
            let pair = tokens.pair(for: configuration.kind)
            configuration.text.font(.caption.bold())
                .padding(.horizontal, 8).padding(.vertical, 2)
                .foregroundStyle(pair.text)
                .background(pair.fill, in: Capsule())
        }
    }
}

/// A tag on the second base surface, in base content.
public struct LilyThemedTagStyle: TagStyle {
    public init() {}
    public func makeBody(configuration: TagStyleConfiguration) -> some View {
        Themed { tokens in
            configuration.text.font(.caption)
                .padding(.horizontal, 8).padding(.vertical, 2)
                .foregroundStyle(tokens.baseContent)
                .background(tokens.base200, in: RoundedRectangle(cornerRadius: tokens.radiusSelector))
        }
    }
}

/// A card on the base surface with a border and the theme's box radius.
public struct LilyThemedCardStyle: CardStyle {
    public init() {}
    public func makeBody(configuration: CardStyleConfiguration) -> some View {
        Themed { tokens in
            VStack(alignment: .leading, spacing: 8) {
                configuration.heading.font(.headline)
                configuration.content
            }
            .padding(16)
            .frame(maxWidth: .infinity, alignment: .leading)
            .foregroundStyle(tokens.baseContent)
            .background(tokens.base100, in: RoundedRectangle(cornerRadius: tokens.radiusBox))
            .overlay(
                RoundedRectangle(cornerRadius: tokens.radiusBox).strokeBorder(tokens.base300, lineWidth: tokens.borderBorder))
        }
    }
}

/// Inset text with a neutral rail at its leading edge.
public struct LilyThemedInsetTextStyle: InsetTextStyle {
    public init() {}
    public func makeBody(configuration: InsetTextStyleConfiguration) -> some View {
        Themed { tokens in
            HStack(spacing: 12) {
                Rectangle().fill(tokens.neutral).frame(width: 4)
                configuration.content.foregroundStyle(tokens.baseContent)
            }
            .fixedSize(horizontal: false, vertical: true)
        }
    }
}

/// A warning in bold base content, its icon on the neutral fill.
public struct LilyThemedWarningTextStyle: WarningTextStyle {
    public init() {}
    public func makeBody(configuration: WarningTextStyleConfiguration) -> some View {
        Themed { tokens in
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                configuration.icon?
                    .foregroundStyle(tokens.neutralContent)
                    .padding(4)
                    .background(tokens.neutral, in: Circle())
                configuration.message.bold().foregroundStyle(tokens.baseContent)
            }
        }
    }
}

/// A summary list item: the term in bold, the value below, both in base content.
public struct LilyThemedSummaryListItemStyle: SummaryListItemStyle {
    public init() {}
    public func makeBody(configuration: SummaryListItemStyleConfiguration) -> some View {
        Themed { tokens in
            VStack(alignment: .leading, spacing: 2) {
                configuration.term.bold()
                configuration.value
            }
            .foregroundStyle(tokens.baseContent)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.vertical, 8)
            .overlay(alignment: .bottom) { Rectangle().fill(tokens.base300).frame(height: tokens.borderBorder) }
        }
    }
}

/// Reads the tokens from the environment for a style's body (a style cannot hold @Environment itself).
struct Themed<Content: View>: View {
    @Environment(\.lilyTokens) private var tokens
    let content: (LilyTokens) -> Content

    init(@ViewBuilder content: @escaping (LilyTokens) -> Content) { self.content = content }

    var body: some View { content(tokens) }
}
