// DecisionSupportCard (components/decision-support-card): a CDS Hooks card. A named group (the summary), its urgency in words,
// its source, suggestions as real buttons, links, the app's detail, and a dismiss button that asks for a reason when reasons
// are offered. A dismissal without one is refused: VoiceOver moves to the reason picker and the app's words are announced.
// Not a live region: whether a critical card interrupts is the app's choice.

import LilyCore
import SwiftUI

public struct DecisionSupportCard<Detail: View>: View {
    /// A suggestion: a real button; the app applies it and enforces selectionBehavior.
    public struct Suggestion: Identifiable, Sendable {
        public let id: String
        public let label: String
        public let isRecommended: Bool
        public init(id: String, label: String, isRecommended: Bool = false) {
            self.id = id
            self.label = label
            self.isRecommended = isRecommended
        }
    }

    public struct Reason: Identifiable, Sendable {
        public let code: String
        public let display: String
        public var id: String { code }
        public init(code: String, display: String) {
            self.code = code
            self.display = display
        }
    }

    let summary: String
    let indicator: DecisionSupportIndicator
    let indicatorLabel: String
    let sourceLabel: String
    let sourceURL: URL?
    let suggestions: [Suggestion]
    let links: [(label: String, url: URL)]
    let dismissLabel: String?
    let overrideReasons: [Reason]
    let overrideReasonLabel: String?
    let overrideReasonPlaceholder: String?
    let overrideReasonError: String?
    let label: String?
    let detail: Detail
    let onSuggestion: @MainActor (String) -> Void
    let onDismiss: @MainActor (String?) -> Void
    @State private var chosen: String = ""
    @State private var refused = false
    @AccessibilityFocusState private var reasonFocused: Bool

    /// - Parameters:
    ///   - summary: the one-sentence summary (under 140 characters); names the card.
    ///   - indicator, indicatorLabel: the urgency, and its words (required: urgency is never colour alone).
    ///   - sourceLabel, sourceURL: where the guidance comes from.
    ///   - suggestions: each a button; `onSuggestion` gets its id.
    ///   - links: further reading.
    ///   - dismissLabel: the dismiss button's words; no button without them.
    ///   - overrideReasons: when given, dismissing needs one; `overrideReasonLabel` names the picker and
    ///     `overrideReasonPlaceholder` is its empty choice.
    ///   - overrideReasonError: words announced when a dismissal is refused (mobile has no invalid state to set).
    ///   - onDismiss: called with the chosen reason's code, or nil when no reasons are offered.
    public init(
        summary: String, indicator: DecisionSupportIndicator, indicatorLabel: String, sourceLabel: String,
        sourceURL: URL? = nil, suggestions: [Suggestion] = [], links: [(label: String, url: URL)] = [],
        dismissLabel: String? = nil, overrideReasons: [Reason] = [], overrideReasonLabel: String? = nil,
        overrideReasonPlaceholder: String? = nil, overrideReasonError: String? = nil, label: String? = nil,
        onSuggestion: @escaping @MainActor (String) -> Void = { _ in },
        onDismiss: @escaping @MainActor (String?) -> Void = { _ in },
        @ViewBuilder detail: () -> Detail
    ) {
        self.summary = summary
        self.indicator = indicator
        self.indicatorLabel = indicatorLabel
        self.sourceLabel = sourceLabel
        self.sourceURL = sourceURL
        self.suggestions = suggestions
        self.links = links
        self.dismissLabel = dismissLabel
        self.overrideReasons = overrideReasons
        self.overrideReasonLabel = overrideReasonLabel
        self.overrideReasonPlaceholder = overrideReasonPlaceholder
        self.overrideReasonError = overrideReasonError
        self.label = label
        self.detail = detail()
        self.onSuggestion = onSuggestion
        self.onDismiss = onDismiss
        LilySemantics.warn(
            DecisionSupportRules.warnings(
                summary: summary, indicatorLabel: indicatorLabel, sourceLabel: sourceLabel,
                reasonsOffered: !overrideReasons.isEmpty, overrideReasonLabel: overrideReasonLabel))
    }

    /// Presses the dismiss button: dismisses, or refuses and moves VoiceOver to the reasons.
    func dismiss() {
        switch DecisionSupportRules.dismiss(reasonsOffered: !overrideReasons.isEmpty, chosen: chosen) {
        case .dismissed(let reason):
            refused = false
            onDismiss(reason)
        case .refused:
            refused = true
            reasonFocused = true
            LilySemantics.errorChanged(from: nil, to: overrideReasonError)
        }
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(verbatim: indicatorLabel).font(.caption.bold())
            Text(verbatim: summary).font(.headline).accessibilityAddTraits(.isHeader)
            if let sourceURL {
                Link(destination: sourceURL) { Text(verbatim: sourceLabel) }
            } else {
                Text(verbatim: sourceLabel).font(.footnote)
            }
            detail
            ForEach(suggestions) { suggestion in
                Button { onSuggestion(suggestion.id) } label: { Text(verbatim: suggestion.label) }
            }
            ForEach(Array(links.enumerated()), id: \.offset) { _, link in
                Link(destination: link.url) { Text(verbatim: link.label) }
            }
            if let dismissLabel {
                if !overrideReasons.isEmpty {
                    Picker(selection: $chosen) {
                        Text(verbatim: overrideReasonPlaceholder ?? "").tag("")
                        ForEach(overrideReasons) { Text(verbatim: $0.display).tag($0.code) }
                    } label: {
                        Text(verbatim: overrideReasonLabel ?? "")
                    }
                    .accessibilityFocused($reasonFocused)
                    .accessibilityHint(
                        Text(verbatim: DecisionSupportRules.reasonHint(refused: refused, error: overrideReasonError)))
                }
                Button(action: dismiss) { Text(verbatim: dismissLabel) }
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text(verbatim: DecisionSupportRules.name(label: label, summary: summary)))
    }
}

extension DecisionSupportCard where Detail == EmptyView {
    public init(
        summary: String, indicator: DecisionSupportIndicator, indicatorLabel: String, sourceLabel: String,
        sourceURL: URL? = nil, suggestions: [Suggestion] = [], links: [(label: String, url: URL)] = [],
        dismissLabel: String? = nil, overrideReasons: [Reason] = [], overrideReasonLabel: String? = nil,
        overrideReasonPlaceholder: String? = nil, overrideReasonError: String? = nil, label: String? = nil,
        onSuggestion: @escaping @MainActor (String) -> Void = { _ in },
        onDismiss: @escaping @MainActor (String?) -> Void = { _ in }
    ) {
        self.init(
            summary: summary, indicator: indicator, indicatorLabel: indicatorLabel, sourceLabel: sourceLabel,
            sourceURL: sourceURL, suggestions: suggestions, links: links, dismissLabel: dismissLabel,
            overrideReasons: overrideReasons, overrideReasonLabel: overrideReasonLabel,
            overrideReasonPlaceholder: overrideReasonPlaceholder, overrideReasonError: overrideReasonError, label: label,
            onSuggestion: onSuggestion, onDismiss: onDismiss
        ) { EmptyView() }
    }
}
