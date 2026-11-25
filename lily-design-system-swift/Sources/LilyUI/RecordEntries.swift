// A record list reads its entries before it says what its status is (HC-C17). Any view in the list is an entry, unless it is a
// Lily item that is refuted or entered in error.

import LilyCore
import SwiftUI

private struct WithdrawnEntryKey: ContainerValueKey {
    static let defaultValue = false
}

extension ContainerValues {
    var lilyWithdrawnEntry: Bool {
        get { self[WithdrawnEntryKey.self] }
        set { self[WithdrawnEntryKey.self] = newValue }
    }
}

struct RecordListLayout<Content: View>: View {
    let component: String
    let isKnown: Bool
    let isNoneKnown: Bool
    let statusLabel: String
    let conflictLabel: String?
    let label: String?
    var coverageLabel: String?
    let content: Content

    var body: some View {
        Group(subviews: content) { subviews in
            let shown = RecordListShown(
                isKnown: isKnown, isNoneKnown: isNoneKnown, statusLabel: statusLabel, conflictLabel: conflictLabel, label: label,
                hasEntries: subviews.contains { !$0.containerValues.lilyWithdrawnEntry })
            let _ = LilySemantics.warn(shown.warnings(component))
            VStack(alignment: .leading, spacing: 12) {
                if let coverageLabel { Text(verbatim: coverageLabel).font(.footnote) }
                if let item = shown.item { Text(verbatim: item) }
                if shown.entries { subviews }
            }
            .accessibilityElement(children: .contain)
            .accessibilityLabel(Text(verbatim: shown.name ?? ""))
        }
    }
}
