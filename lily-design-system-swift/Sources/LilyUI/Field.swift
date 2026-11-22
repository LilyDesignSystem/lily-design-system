// Field (components/field): a label, a description, the consumer's control and an error. On the web the label is linked with
// `for`/`id`; there are no ids here, so the label becomes the control's accessibility label and the error, description and
// required word its hint, and the visible copies are hidden so VoiceOver stops once, on the control. A new error is announced
// when it appears (the web's role="alert" on the error), not on first display.

import SwiftUI

public protocol FieldStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: FieldStyleConfiguration) -> Body
}

public struct FieldStyleConfiguration {
    public let label: Text
    public let required: Bool
    public let description: Text?
    public let error: Text?
    /// The consumer's control, carrying the field's accessibility label and hint.
    public let control: AnyView
}

public struct PlainFieldStyle: FieldStyle {
    public init() {}
    public func makeBody(configuration: FieldStyleConfiguration) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .firstTextBaseline, spacing: 2) {
                configuration.label
                if configuration.required { Text(verbatim: "*") }
            }
            configuration.description?.font(.footnote)
            configuration.error?.bold()
            configuration.control
        }
    }
}

extension FieldStyle where Self == PlainFieldStyle {
    public static var plain: PlainFieldStyle { PlainFieldStyle() }
}

extension FieldStyle {
    @MainActor fileprivate func anyBody(_ configuration: FieldStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct FieldStyleKey: EnvironmentKey {
    static let defaultValue: any FieldStyle = PlainFieldStyle()
}

extension EnvironmentValues {
    public var fieldStyle: any FieldStyle {
        get { self[FieldStyleKey.self] }
        set { self[FieldStyleKey.self] = newValue }
    }
}

extension View {
    public func fieldStyle(_ style: some FieldStyle) -> some View {
        environment(\.fieldStyle, style)
    }
}

public struct Field<Control: View>: View {
    private let label: String
    private let description: String?
    private let error: String?
    private let required: Bool
    private let requiredLabel: String?
    private let control: Control
    @Environment(\.fieldStyle) private var style

    /// - Parameters:
    ///   - label: the visible label, in the consumer's language; also the control's accessibility label.
    ///   - description: help text, spoken as part of the hint.
    ///   - error: the error, spoken first in the hint and announced when it appears.
    ///   - required: shows the required mark (hidden from VoiceOver).
    ///   - requiredLabel: the word spoken for a required field ("required"); iOS has no required trait, so without it
    ///     VoiceOver does not say the field is required.
    ///   - control: the consumer's control (TextField, Picker, Toggle, an identifier input …).
    public init(
        label: String, description: String? = nil, error: String? = nil, required: Bool = false,
        requiredLabel: String? = nil, @ViewBuilder control: () -> Control
    ) {
        self.label = label
        self.description = description
        self.error = error
        self.required = required
        self.requiredLabel = requiredLabel
        self.control = control()
    }

    public var body: some View {
        let hint = LilySemantics.fieldHint(
            description: description, error: error, required: required, requiredLabel: requiredLabel)
        style.anyBody(
            FieldStyleConfiguration(
                label: Text(verbatim: label),
                required: required,
                description: description.map { Text(verbatim: $0) },
                error: error.map { Text(verbatim: $0) },
                control: AnyView(
                    control
                        .accessibilityLabel(Text(verbatim: label))
                        .accessibilityHint(Text(verbatim: hint ?? "")))
            )
        )
        .accessibilityElement(children: .contain)
        .onChange(of: error, LilySemantics.errorChanged)
    }
}
