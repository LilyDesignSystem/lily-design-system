// AllergyRecordList and AllergyRecordListItem (components/allergy-record-list*). The list is a labelled container that is
// never blank: for any status but known its status words are its one item. Each item is one VoiceOver element speaking
// LilyCore's AllergyRules in order, whose record it is first; extra content (a link to the full record) follows as its own
// element. Codes go to the style for colour, and are never the only signal.

import LilyCore
import SwiftUI

public protocol AllergyRecordListItemStyle: Sendable {
    associatedtype Body: View
    @MainActor @ViewBuilder func makeBody(configuration: AllergyRecordListItemStyleConfiguration) -> Body
}

public struct AllergyRecordListItemStyleConfiguration {
    /// The FHIR codes, for the style's colour and icons; never shown as text.
    public let codes: AllergyCodes
    public let subject: Text?
    /// The substance; never truncated.
    public let substance: Text
    /// The reaction, severity, criticality, clinical and verification status, type, category and updated date, in order.
    public let details: [Text]
}

public struct PlainAllergyRecordListItemStyle: AllergyRecordListItemStyle {
    public init() {}
    public func makeBody(configuration: AllergyRecordListItemStyleConfiguration) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            configuration.subject?.font(.footnote)
            configuration.substance.bold().fixedSize(horizontal: false, vertical: true)
            ForEach(Array(configuration.details.enumerated()), id: \.offset) { _, text in text.font(.subheadline) }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

extension AllergyRecordListItemStyle where Self == PlainAllergyRecordListItemStyle {
    public static var plain: PlainAllergyRecordListItemStyle { PlainAllergyRecordListItemStyle() }
}

extension AllergyRecordListItemStyle {
    @MainActor fileprivate func anyBody(_ configuration: AllergyRecordListItemStyleConfiguration) -> AnyView {
        AnyView(makeBody(configuration: configuration))
    }
}

private struct AllergyRecordListItemStyleKey: EnvironmentKey {
    static let defaultValue: any AllergyRecordListItemStyle = PlainAllergyRecordListItemStyle()
}

extension EnvironmentValues {
    public var allergyRecordListItemStyle: any AllergyRecordListItemStyle {
        get { self[AllergyRecordListItemStyleKey.self] }
        set { self[AllergyRecordListItemStyleKey.self] = newValue }
    }
}

extension View {
    public func allergyRecordListItemStyle(_ style: some AllergyRecordListItemStyle) -> some View {
        environment(\.allergyRecordListItemStyle, style)
    }
}

public struct AllergyRecordList<Content: View>: View {
    let status: AllergyListStatus
    let statusLabel: String
    let label: String?
    let conflictLabel: String?
    let content: Content

    /// - Parameters:
    ///   - status: known, none known, not recorded, unavailable, omitted or not applicable. Required.
    ///   - statusLabel: the status in words ("No known allergies"); names the list, and is its one item unless known.
    ///   - label: the list's name, when it should differ from the status words.
    ///   - conflictLabel: your words for a list that says none are known and holds an entry, shown instead; never both.
    ///   - content: `AllergyRecordListItem`s, shown when the status is known, and beside none known when there are any.
    public init(
        status: AllergyListStatus, statusLabel: String, label: String? = nil, conflictLabel: String? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.status = status
        self.statusLabel = statusLabel
        self.label = label
        self.conflictLabel = conflictLabel
        self.content = content()
        LilySemantics.warn(AllergyRules.listWarnings(statusLabel: statusLabel))
    }

    public var body: some View {
        RecordListLayout(
            component: "AllergyRecordList", isKnown: status == .known, isNoneKnown: status == .noneKnown, statusLabel: statusLabel,
            conflictLabel: conflictLabel, label: label, content: content)
    }
}

extension AllergyRecordList where Content == EmptyView {
    /// A list with no items: its status words are its one item.
    public init(status: AllergyListStatus, statusLabel: String, label: String? = nil) {
        self.init(status: status, statusLabel: statusLabel, label: label) { EmptyView() }
    }
}

public struct AllergyRecordListItem<Extra: View>: View {
    let codes: AllergyCodes
    let words: AllergyWords
    let extra: Extra
    @Environment(\.allergyRecordListItemStyle) private var style

    /// - Parameters:
    ///   - words: the substance and every part's words, in the app's language (`AllergyWords`).
    ///   - codes: the FHIR codes; each needs its words in `words`, or a development warning is printed.
    ///   - extra: anything else, such as a link to the full record; its own VoiceOver element.
    public init(_ words: AllergyWords, codes: AllergyCodes = AllergyCodes(), @ViewBuilder extra: () -> Extra) {
        self.words = words
        self.codes = codes
        self.extra = extra()
        LilySemantics.warn(AllergyRules.itemWarnings(codes: codes, words: words))
    }

    public var body: some View {
        let details = [
            words.reaction, words.severity, words.criticality, words.clinicalStatus, words.verificationStatus, words.type,
            words.category, words.updated,
        ].compactMap { $0 }.filter { !$0.isEmpty }.map { Text(verbatim: $0) }
        VStack(alignment: .leading, spacing: 4) {
            style.anyBody(
                AllergyRecordListItemStyleConfiguration(
                    codes: codes, subject: words.subject.map { Text(verbatim: $0) },
                    substance: Text(verbatim: words.substance), details: details)
            )
            .accessibilityElement(children: .ignore)
            .accessibilityAddTraits(.isStaticText)
            .accessibilityLabel(Text(verbatim: AllergyRules.spoken(words)))
            extra
        }
        .accessibilityElement(children: .contain)
        .containerValue(\.lilyWithdrawnEntry, AllergyRules.isWithdrawn(codes))
    }
}

extension AllergyRecordListItem where Extra == EmptyView {
    public init(_ words: AllergyWords, codes: AllergyCodes = AllergyCodes()) {
        self.init(words, codes: codes) { EmptyView() }
    }
}
