// Tag (components/tag): a label on an item ("High", "Draft"). Not live by default: a screen of static tags must not be a screen
// of live regions. The required `label` gives the context the visible text lacks and is spoken after it ("High", then
// "priority"); with `live`, the label is the spoken name and a change of the text is announced politely, as the web's
// role="status" with aria-label.

import SwiftUI

public protocol TagStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: TagStyleConfiguration) -> Body
}

public struct TagStyleConfiguration {
    public let text: Text
}

public struct PlainTagStyle: TagStyle {
    public init() {}
    public func makeBody(configuration: TagStyleConfiguration) -> some View {
        configuration.text.font(.caption)
    }
}

extension TagStyle where Self == PlainTagStyle {
    public static var plain: PlainTagStyle { PlainTagStyle() }
}

extension TagStyle {
    @MainActor fileprivate func anyBody(_ configuration: TagStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct TagStyleKey: EnvironmentKey {
    static let defaultValue: any TagStyle = PlainTagStyle()
}

extension EnvironmentValues {
    public var tagStyle: any TagStyle {
        get { self[TagStyleKey.self] }
        set { self[TagStyleKey.self] = newValue }
    }
}

extension View {
    public func tagStyle(_ style: some TagStyle) -> some View {
        environment(\.tagStyle, style)
    }
}

public struct Tag: View {
    private let text: String
    private let label: String
    private let live: Bool
    @Environment(\.tagStyle) private var style

    /// - Parameters:
    ///   - text: the visible text, in the app's language.
    ///   - label: the context, in the app's language; spoken after the text, or as the name when `live`. Required.
    ///   - live: announce changes of the text politely, for a tag whose text changes in place.
    public init(_ text: String, label: String, live: Bool = false) {
        self.text = text
        self.label = label
        self.live = live
    }

    public var body: some View {
        style.anyBody(TagStyleConfiguration(text: Text(verbatim: text)))
            .accessibilityElement(children: .ignore)
            .accessibilityAddTraits(.isStaticText)
            .accessibilityLabel(Text(verbatim: LilySemantics.tagLabel(text: text, label: label, live: live)))
            .accessibilityValue(Text(verbatim: live ? text : ""))
            .onChange(of: text, textChanged)
    }

    func textChanged(from _: String, to newText: String) {
        guard live else { return }
        LilySemantics.announce(LilySemantics.announcement(heading: label, message: newText, politeness: .polite))
    }
}
