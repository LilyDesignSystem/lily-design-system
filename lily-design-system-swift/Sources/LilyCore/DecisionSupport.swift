// The rules of decision-support-card (components/decision-support-card, CDS Hooks cards). The urgency is always words; a
// dismissal that needs a reason and has none is refused; the app applies suggestions and enforces selectionBehavior.

public enum DecisionSupportIndicator: String, Sendable, CaseIterable {
    case info, warning, critical
}

/// What happens when the dismiss button is pressed.
public enum DismissOutcome: Equatable, Sendable {
    /// Dismissed, with the chosen reason's code, or nil when no reasons are offered.
    case dismissed(reason: String?)
    /// Refused: reasons are offered and none was chosen. Focus moves to the reasons.
    case refused
}

public enum DecisionSupportRules {
    /// The card's accessible name: the label, else the summary.
    public static func name(label: String?, summary: String) -> String {
        if let label, !label.isEmpty { return label }
        return summary
    }

    /// Whether a dismissal goes ahead.
    public static func dismiss(reasonsOffered: Bool, chosen: String?) -> DismissOutcome {
        if !reasonsOffered { return .dismissed(reason: nil) }
        guard let chosen, !chosen.isEmpty else { return .refused }
        return .dismissed(reason: chosen)
    }

    /// The reason picker's hint: the app's error words after a refused dismissal, else nothing.
    public static func reasonHint(refused: Bool, error: String?) -> String {
        refused ? (error ?? "") : ""
    }

    public static func warnings(
        summary: String, indicatorLabel: String, sourceLabel: String, reasonsOffered: Bool = false,
        overrideReasonLabel: String? = nil
    ) -> [String] {
        var out: [String] = []
        if reasonsOffered, overrideReasonLabel?.isEmpty ?? true {
            out.append("DecisionSupportCard: overrideReasons need an overrideReasonLabel to name the picker")
        }
        if summary.count > 140 { out.append("DecisionSupportCard: CDS Hooks keeps a summary under 140 characters") }
        if indicatorLabel.isEmpty { out.append("DecisionSupportCard: an indicatorLabel is required, or urgency is colour alone") }
        if sourceLabel.isEmpty { out.append("DecisionSupportCard: a sourceLabel is required") }
        return out
    }
}
