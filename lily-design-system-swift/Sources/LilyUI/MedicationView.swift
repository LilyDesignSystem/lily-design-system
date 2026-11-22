// MedicationView (components/medication-view): a medicine's name, strength, form, route, frequency and free-text dosage. Tall
// man segments the app marks are emphasised; the spoken name stays one word. One VoiceOver element; no part is truncated.

import LilyCore
import SwiftUI

public protocol MedicationViewStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: MedicationViewStyleConfiguration) -> Body
}

public struct MedicationViewStyleConfiguration {
    /// The name, with tall man segments already emphasised.
    public let name: Text?
    /// The strength, form, route, frequency and dosage text, in order.
    public let details: [Text]
}

public struct PlainMedicationViewStyle: MedicationViewStyle {
    public init() {}
    public func makeBody(configuration: MedicationViewStyleConfiguration) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            configuration.name?.fixedSize(horizontal: false, vertical: true)
            ForEach(Array(configuration.details.enumerated()), id: \.offset) { _, text in
                text.fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}

extension MedicationViewStyle where Self == PlainMedicationViewStyle {
    public static var plain: PlainMedicationViewStyle { PlainMedicationViewStyle() }
}

extension MedicationViewStyle {
    @MainActor fileprivate func anyBody(_ configuration: MedicationViewStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct MedicationViewStyleKey: EnvironmentKey {
    static let defaultValue: any MedicationViewStyle = PlainMedicationViewStyle()
}

extension EnvironmentValues {
    public var medicationViewStyle: any MedicationViewStyle {
        get { self[MedicationViewStyleKey.self] }
        set { self[MedicationViewStyleKey.self] = newValue }
    }
}

extension View {
    public func medicationViewStyle(_ style: some MedicationViewStyle) -> some View {
        environment(\.medicationViewStyle, style)
    }
}

public struct MedicationView: View {
    let name: String?
    let nameSegments: [MedicationNameSegment]
    let strength: String?
    let form: String?
    let route: String?
    let frequency: String?
    let dosageText: String?
    let label: String?
    @Environment(\.medicationViewStyle) private var style

    /// - Parameters:
    ///   - name: the name as plain text; or `nameSegments`, with tall man letters marked, which wins when given.
    ///   - strength: formatted by the app (`formatQuantity` writes "5 mg", never "5.0 mg").
    ///   - form, route, frequency: in the app's words.
    ///   - dosageText: the dose as free text, when the record has no structured parts.
    ///   - label: spoken first, naming the value.
    public init(
        name: String? = nil, nameSegments: [MedicationNameSegment] = [], strength: String? = nil, form: String? = nil,
        route: String? = nil, frequency: String? = nil, dosageText: String? = nil, label: String? = nil
    ) {
        self.name = name
        self.nameSegments = nameSegments
        self.strength = strength
        self.form = form
        self.route = route
        self.frequency = frequency
        self.dosageText = dosageText
        self.label = label
    }

    /// The name with each tall man segment in bold.
    var nameText: Text? {
        if nameSegments.isEmpty { return name.map { Text(verbatim: $0) } }
        return nameSegments.reduce(Text(verbatim: "")) { text, segment in
            text + (segment.tallMan ? Text(verbatim: segment.text).bold() : Text(verbatim: segment.text))
        }
    }

    public var body: some View {
        let details = [strength, form, route, frequency, dosageText].compactMap { $0 }.filter { !$0.isEmpty }
        style.anyBody(MedicationViewStyleConfiguration(name: nameText, details: details.map { Text(verbatim: $0) }))
            .accessibilityElement(children: .ignore)
            .accessibilityAddTraits(.isStaticText)
            .accessibilityLabel(
                Text(
                    verbatim: MedicationRules.spoken(
                        label: label, name: name, segments: nameSegments, strength: strength, form: form, route: route,
                        frequency: frequency, dosageText: dosageText)))
    }
}
