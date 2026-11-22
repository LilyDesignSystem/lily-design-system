// InsetText (components/inset-text): supplementary text set apart from its surroundings (the web's role="note"). Read as
// one VoiceOver element.

import SwiftUI

public protocol InsetTextStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: InsetTextStyleConfiguration) -> Body
}

public struct InsetTextStyleConfiguration {
    public let content: AnyView
}

public struct PlainInsetTextStyle: InsetTextStyle {
    public init() {}
    public func makeBody(configuration: InsetTextStyleConfiguration) -> some View {
        configuration.content.padding(.leading, 12)
    }
}

extension InsetTextStyle where Self == PlainInsetTextStyle {
    public static var plain: PlainInsetTextStyle { PlainInsetTextStyle() }
}

extension InsetTextStyle {
    @MainActor fileprivate func anyBody(_ configuration: InsetTextStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct InsetTextStyleKey: EnvironmentKey {
    static let defaultValue: any InsetTextStyle = PlainInsetTextStyle()
}

extension EnvironmentValues {
    public var insetTextStyle: any InsetTextStyle {
        get { self[InsetTextStyleKey.self] }
        set { self[InsetTextStyleKey.self] = newValue }
    }
}

extension View {
    public func insetTextStyle(_ style: some InsetTextStyle) -> some View {
        environment(\.insetTextStyle, style)
    }
}

public struct InsetText<Content: View>: View {
    private let content: Content
    @Environment(\.insetTextStyle) private var style

    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    public var body: some View {
        style.anyBody(InsetTextStyleConfiguration(content: AnyView(content)))
            .accessibilityElement(children: .combine)
    }
}
