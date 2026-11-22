// The rules of medication-view, the twin of LilyCore's MedicationRules in Swift. Tall man letters come from the app as
// marked segments; the spoken name is the segments joined, one word; no part is ever truncated.
package io.github.lilydesignsystem.core

/** One part of a medication name; [tallMan] parts are emphasised ("hydr" + "OXY" + "zine"). */
public data class MedicationNameSegment(val text: String, val tallMan: Boolean = false)

public object MedicationRules {
    /** The name as plain text: the segments joined when given, else the name. */
    public fun name(name: String?, segments: List<MedicationNameSegment>): String? =
        if (segments.isNotEmpty()) segments.joinToString("") { it.text } else name

    /** Everything spoken, in order: label, name, strength, form, route, frequency, then free-text dosage. */
    public fun spoken(
        label: String?,
        name: String?,
        segments: List<MedicationNameSegment>,
        strength: String?,
        form: String?,
        route: String?,
        frequency: String?,
        dosageText: String?,
    ): String = listOf(label, name(name, segments), strength, form, route, frequency, dosageText)
        .filterNotNull().filter { it.isNotEmpty() }.joinToString("\n")
}
