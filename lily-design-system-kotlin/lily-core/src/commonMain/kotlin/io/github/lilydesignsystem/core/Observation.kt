// The rules of observation-view (components/observation-view), the twin of LilyCore's ObservationRules in Swift. They decide
// what is shown and spoken, never what a result means: no interpretation is inferred from a range, and the flag is the
// consumer's words, so its meaning is never colour alone.
package io.github.lilydesignsystem.core

/** A FHIR Observation status, or one of Lily's absences. */
public enum class ObservationStatus(public val key: String) {
    Final("final"), Registered("registered"), Unknown("unknown"), Preliminary("preliminary"), Amended("amended"), Corrected("corrected"),
    EnteredInError("entered-in-error"), Cancelled("cancelled"), Masked("masked"), NotRecorded("not-recorded"),
    Unavailable("unavailable"), NotApplicable("not-applicable"),
}

/** A further named reference range ("Critical", "below 2.5"). */
public data class NamedRange(val label: String, val text: String)

public object ObservationRules {
    private const val NO_BREAK_SPACE = " "

    /** A missing result shows its status words instead of a value, so it is never blank or a dash. */
    public fun statusReplacesValue(status: ObservationStatus): Boolean = status in setOf(
        ObservationStatus.Registered, ObservationStatus.Cancelled, ObservationStatus.Masked, ObservationStatus.NotRecorded,
        ObservationStatus.Unavailable, ObservationStatus.NotApplicable,
    )

    /**
     * Whether nothing of the result but its status words is shown or spoken: no value, flag, range, meter or earlier value. A
     * missing result, one with no words for a status that is not final, and an entered-in-error one, whose former value an
     * authorised history view shows with [showWithdrawn].
     */
    public fun withholds(status: ObservationStatus, statusLabel: String?, showWithdrawn: Boolean = false): Boolean =
        statusReplacesValue(status) || (showsStatus(status) && !hasWords(statusLabel)) ||
            (isWithdrawn(status) && !showWithdrawn)

    /** An entered-in-error result: its value, when shown at all, is a former one, with no flag, range or meter. */
    public fun isWithdrawn(status: ObservationStatus): Boolean = status == ObservationStatus.EnteredInError

    /** Any status but final is shown, beside the value or instead of it. */
    public fun showsStatus(status: ObservationStatus): Boolean = status != ObservationStatus.Final

    /** Whether a FHIR v3 ObservationInterpretation code is a flag (anything but normal). No code is never a flag. */
    public fun isFlagged(interpretation: String?): Boolean = !interpretation.isNullOrEmpty() && interpretation != "N"

    /** The development warnings for a set of props, in English for the developer (never shown to the user). */
    public fun warnings(
        interpretation: String?,
        flagLabel: String?,
        status: ObservationStatus,
        statusLabel: String?,
        previousValue: String?,
        previousLabel: String?,
    ): List<String> = buildList {
        if (isFlagged(interpretation) && flagLabel.isNullOrEmpty()) {
            add("ObservationView: interpretation $interpretation needs a flagLabel, or the flag is colour alone")
        }
        if (showsStatus(status) && !hasWords(statusLabel)) add("ObservationView: status ${status.key} needs a statusLabel")
        if (previousValue != null && previousLabel.isNullOrEmpty()) {
            add("ObservationView: previousValue needs a previousLabel, since the change may not be announced")
        }
    }

    /** The value and unit joined by a no-break space; null when the status replaces it. */
    public fun shownValue(value: String?, unit: String?, status: ObservationStatus): String? = when {
        statusReplacesValue(status) || value.isNullOrEmpty() -> null
        unit.isNullOrEmpty() -> value
        else -> value + NO_BREAK_SPACE + unit
    }

    /** Everything spoken, in reading order, joined by line breaks; Lily adds no words. */
    public fun spoken(
        label: String?,
        value: String?,
        unit: String?,
        flagLabel: String?,
        interpretation: String?,
        range: String?,
        ranges: List<NamedRange> = emptyList(),
        status: ObservationStatus,
        statusLabel: String?,
        previousLabel: String?,
        showWithdrawn: Boolean = false,
    ): String {
        val pieces = mutableListOf(label)
        if (withholds(status, statusLabel, showWithdrawn) || isWithdrawn(status)) {
            pieces += statusLabel
            // The words first, so a former value is never heard as a current one.
            if (!withholds(status, statusLabel, showWithdrawn)) pieces += shownValue(value, unit, status)
            return pieces.filterNotNull().filter { it.isNotEmpty() }.joinToString("\n")
        }
        pieces += shownValue(value, unit, status)
        if (isFlagged(interpretation)) pieces += flagLabel
        pieces += range
        ranges.forEach { pieces += it.label + NO_BREAK_SPACE + it.text }
        if (showsStatus(status)) pieces += statusLabel
        pieces += previousLabel
        return pieces.filterNotNull().filter { it.isNotEmpty() }.joinToString("\n")
    }
}
