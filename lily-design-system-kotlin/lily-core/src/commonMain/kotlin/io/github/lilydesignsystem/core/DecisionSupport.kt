// The rules of decision-support-card, the twin of LilyCore's DecisionSupportRules in Swift.
package io.github.lilydesignsystem.core

public enum class DecisionSupportIndicator(public val key: String) { Info("info"), Warning("warning"), Critical("critical") }

/** What happens when the dismiss button is pressed. */
public sealed interface DismissOutcome {
    /** Dismissed, with the chosen reason's code, or null when no reasons are offered. */
    public data class Dismissed(val reason: String?) : DismissOutcome

    /** Refused: reasons are offered and none was chosen. Focus moves to the reasons. */
    public data object Refused : DismissOutcome
}

public object DecisionSupportRules {
    /** The card's accessible name: the label, else the summary. */
    public fun name(label: String?, summary: String): String = if (label.isNullOrEmpty()) summary else label

    /** Which card this is: the app's id (the CDS Hooks uuid with the patient's id), else what it says. */
    public fun identity(cardId: String?, summary: String, indicator: DecisionSupportIndicator, sourceLabel: String): List<String> =
        if (cardId != null) listOf(cardId) else listOf(summary, indicator.key, sourceLabel)

    /** Whether a dismissal goes ahead: the chosen reason must be one this card offers. */
    public fun dismiss(offered: List<String>, chosen: String?): DismissOutcome = when {
        offered.isEmpty() -> DismissOutcome.Dismissed(null)
        chosen == null || chosen !in offered -> DismissOutcome.Refused
        else -> DismissOutcome.Dismissed(chosen)
    }

    public fun warnings(
        summary: String,
        indicatorLabel: String,
        sourceLabel: String,
        reasonsOffered: Boolean = false,
        overrideReasonLabel: String? = null,
    ): List<String> = buildList {
        if (reasonsOffered && overrideReasonLabel.isNullOrEmpty()) {
            add("DecisionSupportCard: overrideReasons need an overrideReasonLabel to name the picker")
        }
        if (summary.length > 140) add("DecisionSupportCard: CDS Hooks keeps a summary under 140 characters")
        if (indicatorLabel.isEmpty()) add("DecisionSupportCard: an indicatorLabel is required, or urgency is colour alone")
        if (sourceLabel.isEmpty()) add("DecisionSupportCard: a sourceLabel is required")
    }
}
