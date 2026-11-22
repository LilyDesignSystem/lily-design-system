// ErrorSummary (components/error-summary): the problems with a form, shown at the top after a failed submit. On the web it is
// role="alert" and takes focus; here it moves VoiceOver focus to its title when it appears (the title is a heading), and each
// problem is a button that runs the consumer's action, which should move focus to the field (with @FocusState or
// @AccessibilityFocusState) and scroll to it.

import SwiftUI

public protocol ErrorSummaryStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: ErrorSummaryStyleConfiguration) -> Body
}

public struct ErrorSummaryStyleConfiguration {
    /// The title, already a heading and the focus target.
    public let title: AnyView
    /// The problems, as buttons, in order.
    public let items: AnyView
}

public struct PlainErrorSummaryStyle: ErrorSummaryStyle {
    public init() {}
    public func makeBody(configuration: ErrorSummaryStyleConfiguration) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            configuration.title.font(.headline)
            configuration.items
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

extension ErrorSummaryStyle where Self == PlainErrorSummaryStyle {
    public static var plain: PlainErrorSummaryStyle { PlainErrorSummaryStyle() }
}

extension ErrorSummaryStyle {
    @MainActor fileprivate func anyBody(_ configuration: ErrorSummaryStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct ErrorSummaryStyleKey: EnvironmentKey {
    static let defaultValue: any ErrorSummaryStyle = PlainErrorSummaryStyle()
}

extension EnvironmentValues {
    public var errorSummaryStyle: any ErrorSummaryStyle {
        get { self[ErrorSummaryStyleKey.self] }
        set { self[ErrorSummaryStyleKey.self] = newValue }
    }
}

extension View {
    public func errorSummaryStyle(_ style: some ErrorSummaryStyle) -> some View {
        environment(\.errorSummaryStyle, style)
    }
}

public struct ErrorSummary: View {
    /// One problem: what is wrong, in the consumer's words, and what to do when it is chosen (focus the field).
    public struct Problem {
        public let message: String
        public let action: @MainActor () -> Void
        public init(_ message: String, action: @escaping @MainActor () -> Void) {
            self.message = message
            self.action = action
        }
    }

    private let title: String
    private let problems: [Problem]
    private let focusOnAppear: Bool
    @AccessibilityFocusState private var titleFocused: Bool
    @Environment(\.errorSummaryStyle) private var style

    /// - Parameters:
    ///   - title: the heading ("There is a problem"), in the consumer's language.
    ///   - problems: the problems, in the order of the fields.
    ///   - focusOnAppear: move VoiceOver focus to the title when the summary appears (default true, as the web focuses it).
    public init(title: String, problems: [Problem], focusOnAppear: Bool = true) {
        self.title = title
        self.problems = problems
        self.focusOnAppear = focusOnAppear
    }

    public var body: some View {
        style.anyBody(
            ErrorSummaryStyleConfiguration(
                title: AnyView(
                    Text(verbatim: title)
                        .accessibilityAddTraits(.isHeader)
                        .accessibilityFocused($titleFocused)),
                items: AnyView(
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(Array(problems.enumerated()), id: \.offset) { _, problem in
                            Button(action: problem.action) { Text(verbatim: problem.message) }
                                .buttonStyle(.borderless)
                                .multilineTextAlignment(.leading)
                        }
                    })
            )
        )
        .accessibilityElement(children: .contain)
        .onAppear { if focusOnAppear { titleFocused = true } }
    }
}
