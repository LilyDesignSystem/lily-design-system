// Card (components/card): a heading and content. Not a stand-alone item by default, so it is not one VoiceOver element; its
// heading is a header at the given level (the web's h2 to h6, for the rotor), and a `label` makes it a named group
// (the web's role="group" with aria-label). A linked card is not yet ported: put a NavigationLink or Button in the content.

import SwiftUI

public protocol CardStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: CardStyleConfiguration) -> Body
}

public struct CardStyleConfiguration {
    /// The heading, already a header at its level; `nil` when none was given.
    public let heading: AnyView?
    public let content: AnyView
}

public struct PlainCardStyle: CardStyle {
    public init() {}
    public func makeBody(configuration: CardStyleConfiguration) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            configuration.heading.font(.headline)
            configuration.content
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

extension CardStyle where Self == PlainCardStyle {
    public static var plain: PlainCardStyle { PlainCardStyle() }
}

extension CardStyle {
    @MainActor fileprivate func anyBody(_ configuration: CardStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct CardStyleKey: EnvironmentKey {
    static let defaultValue: any CardStyle = PlainCardStyle()
}

extension EnvironmentValues {
    public var cardStyle: any CardStyle {
        get { self[CardStyleKey.self] }
        set { self[CardStyleKey.self] = newValue }
    }
}

extension View {
    public func cardStyle(_ style: some CardStyle) -> some View {
        environment(\.cardStyle, style)
    }
}

public struct Card<Content: View>: View {
    private let heading: String?
    private let headingLevel: HeadingLevel
    private let label: String?
    private let content: Content
    @Environment(\.cardStyle) private var style

    /// - Parameters:
    ///   - heading: the heading, in the app's language.
    ///   - headingLevel: 2 to 6, as on the web (default `.h3`).
    ///   - label: names the card as a group.
    ///   - content: the card's body.
    public init(heading: String? = nil, headingLevel: HeadingLevel = .h3, label: String? = nil, @ViewBuilder content: () -> Content) {
        self.heading = heading
        self.headingLevel = headingLevel
        self.label = label
        self.content = content()
    }

    public var body: some View {
        let card = style.anyBody(
            CardStyleConfiguration(
                heading: heading.map {
                    AnyView(
                        Text(verbatim: $0)
                            .accessibilityAddTraits(.isHeader)
                            .accessibilityHeading(LilySemantics.headingLevel(headingLevel)))
                },
                content: AnyView(content)))
        if let label {
            card.accessibilityElement(children: .contain).accessibilityLabel(Text(verbatim: label))
        } else {
            card
        }
    }
}
