// RecordList and RecordListItem (components/record-list*): the shape every clinical list shares. On mobile the medication,
// problem, immunisation, procedure and device lists are this list with a Lily view as each item's content
// (mobile/components-mobile.tsv: pattern). Each item is one VoiceOver element, read in order: whose record, the entry state,
// the content (unless withheld), the status, the update.

import LilyCore
import SwiftUI

public struct RecordList<Content: View>: View {
    let status: RecordListStatus
    let statusLabel: String
    let label: String?
    let coverageLabel: String?
    let content: Content

    /// - Parameters:
    ///   - status: known, none known, not recorded, unavailable, omitted or not applicable. Required.
    ///   - statusLabel: the status in words; names the list, and is its one item unless known.
    ///   - label: the list's name, when it should differ from the status words.
    ///   - coverageLabel: what the list is a view of (its window, its order, what is left out), shown first.
    ///   - content: `RecordListItem`s, shown when the status is known.
    public init(
        status: RecordListStatus, statusLabel: String, label: String? = nil, coverageLabel: String? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.status = status
        self.statusLabel = statusLabel
        self.label = label
        self.coverageLabel = coverageLabel
        self.content = content()
        LilySemantics.warn(RecordRules.listWarnings(statusLabel: statusLabel))
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let coverageLabel { Text(verbatim: coverageLabel).font(.footnote) }
            if RecordRules.showsStatusItem(status) { Text(verbatim: statusLabel) } else { content }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text(verbatim: RecordRules.listName(label: label, statusLabel: statusLabel)))
    }
}

extension RecordList where Content == EmptyView {
    public init(status: RecordListStatus, statusLabel: String, label: String? = nil, coverageLabel: String? = nil) {
        self.init(status: status, statusLabel: statusLabel, label: label, coverageLabel: coverageLabel) { EmptyView() }
    }
}

public struct RecordListItem<Content: View>: View {
    let subjectLabel: String?
    let status: String?
    let statusLabel: String?
    let updatedLabel: String?
    let entryState: RecordEntryState?
    let entryStateLabel: String?
    let content: Content

    /// - Parameters:
    ///   - subjectLabel: whose record it is, when it is not the patient's ("Mother"); first.
    ///   - status, statusLabel: the record's status as the app's code, and its words (required with a code).
    ///   - updatedLabel: when the record was last updated, as the app writes it.
    ///   - entryState, entryStateLabel: withheld (only the words are shown) or entered in error (struck through), with words.
    ///   - content: the record itself, usually a Lily view (`MedicationView`, `ObservationView`).
    public init(
        subjectLabel: String? = nil, status: String? = nil, statusLabel: String? = nil, updatedLabel: String? = nil,
        entryState: RecordEntryState? = nil, entryStateLabel: String? = nil, @ViewBuilder content: () -> Content
    ) {
        self.subjectLabel = subjectLabel
        self.status = status
        self.statusLabel = statusLabel
        self.updatedLabel = updatedLabel
        self.entryState = entryState
        self.entryStateLabel = entryStateLabel
        self.content = content()
        LilySemantics.warn(
            RecordRules.itemWarnings(
                status: status, statusLabel: statusLabel, entryState: entryState, entryStateLabel: entryStateLabel))
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if let subjectLabel { Text(verbatim: subjectLabel).font(.footnote) }
            if let entryStateLabel, entryState != nil { Text(verbatim: entryStateLabel).bold() }
            if RecordRules.showsContent(entryState) {
                content.strikethrough(RecordRules.strikesContent(entryState))
            }
            if let statusLabel { Text(verbatim: statusLabel) }
            if let updatedLabel { Text(verbatim: updatedLabel).font(.footnote) }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
    }
}
