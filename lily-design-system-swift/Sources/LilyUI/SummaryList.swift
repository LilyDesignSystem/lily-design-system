// SummaryList and SummaryListItem (components/summary-list): labelled term-and-value pairs. Each item is read as one element,
// term then value; the list is a labelled container. The plain style stacks the value under the term, so nothing truncates at
// the largest Dynamic Type sizes.

import SwiftUI

public protocol SummaryListItemStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: SummaryListItemStyleConfiguration) -> Body
}

public struct SummaryListItemStyleConfiguration {
    public let term: Text
    public let value: AnyView
}

public struct PlainSummaryListItemStyle: SummaryListItemStyle {
    public init() {}
    public func makeBody(configuration: SummaryListItemStyleConfiguration) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            configuration.term.bold()
            configuration.value
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

extension SummaryListItemStyle where Self == PlainSummaryListItemStyle {
    public static var plain: PlainSummaryListItemStyle { PlainSummaryListItemStyle() }
}

extension SummaryListItemStyle {
    @MainActor fileprivate func anyBody(_ configuration: SummaryListItemStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct SummaryListItemStyleKey: EnvironmentKey {
    static let defaultValue: any SummaryListItemStyle = PlainSummaryListItemStyle()
}

extension EnvironmentValues {
    public var summaryListItemStyle: any SummaryListItemStyle {
        get { self[SummaryListItemStyleKey.self] }
        set { self[SummaryListItemStyleKey.self] = newValue }
    }
}

extension View {
    public func summaryListItemStyle(_ style: some SummaryListItemStyle) -> some View {
        environment(\.summaryListItemStyle, style)
    }
}

public struct SummaryList<Content: View>: View {
    private let label: String
    private let content: Content

    /// - Parameters:
    ///   - label: the list's accessible name, in the consumer's language.
    ///   - content: `SummaryListItem`s.
    public init(label: String, @ViewBuilder content: () -> Content) {
        self.label = label
        self.content = content()
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 12) { content }
            .accessibilityElement(children: .contain)
            .accessibilityLabel(Text(verbatim: label))
    }
}

public struct SummaryListItem<Value: View>: View {
    private let term: String
    private let value: Value
    @Environment(\.summaryListItemStyle) private var style

    /// - Parameters:
    ///   - term: the key, in the consumer's language.
    ///   - value: the value; a missing value should be the consumer's words, never a dash.
    public init(term: String, @ViewBuilder value: () -> Value) {
        self.term = term
        self.value = value()
    }

    public var body: some View {
        style.anyBody(SummaryListItemStyleConfiguration(term: Text(verbatim: term), value: AnyView(value)))
            .accessibilityElement(children: .combine)
    }
}
