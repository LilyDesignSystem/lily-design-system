// What a record list says about itself, and whether that can be true (HC-C17), the twin of LilyCore's RecordListShown in Swift.
// "None known" beside an entry is a contradiction, and either half of it may be the wrong one. So the entry stays, the words
// "none known" go, and the app's own words for the conflict take their place, as the list's item and its name.
package io.github.lilydesignsystem.core

/**
 * @property name the list's name; null when nothing true can be said.
 * @property item the words of the list's status item, or null when there is none.
 * @property entries whether the entries are shown.
 */
public data class RecordListShown(
    val name: String?,
    val item: String?,
    val entries: Boolean,
    val conflict: Boolean,
) {
    public fun warnings(list: String): List<String> =
        if (conflict && item == null) {
            listOf("$list: it says none are known and holds an entry; give a conflictLabel, your words for that")
        } else {
            emptyList()
        }

    public companion object {
        public fun of(
            isKnown: Boolean,
            isNoneKnown: Boolean,
            statusLabel: String,
            conflictLabel: String?,
            label: String?,
            hasEntries: Boolean,
        ): RecordListShown {
            val conflict = isNoneKnown && hasEntries
            val words = if (conflict) conflictLabel?.takeIf { hasWords(it) } else statusLabel
            return RecordListShown(
                // A label that only repeats the status is the status, so it goes with it.
                name = if (label.isNullOrEmpty() || (conflict && label == statusLabel)) words else label,
                item = if (isKnown) null else words,
                entries = isKnown || isNoneKnown,
                conflict = conflict,
            )
        }
    }
}

/** An entry someone has withdrawn does not contradict "none known". */
public fun RecordRules.isWithdrawn(status: String?, entryState: RecordEntryState?): Boolean =
    entryState == RecordEntryState.EnteredInError || status == "entered-in-error"

public fun AllergyRules.isWithdrawn(codes: AllergyCodes?): Boolean =
    codes?.verificationStatus == "refuted" || codes?.verificationStatus == "entered-in-error"
