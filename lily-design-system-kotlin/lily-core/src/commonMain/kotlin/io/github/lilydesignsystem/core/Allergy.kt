// The rules of allergy-record-list and allergy-record-list-item, the twin of LilyCore's AllergyRules in Swift. A list is
// never blank; every coded field is shown in the app's words; a relative's record says whose it is first.
package io.github.lilydesignsystem.core

public enum class AllergyListStatus(public val key: String) {
    Known("known"), NoneKnown("none-known"), NotRecorded("not-recorded"), Unavailable("unavailable"), Omitted("omitted"),
    NotApplicable("not-applicable"),
}

/** The FHIR AllergyIntolerance codes an item takes; each is shown only through its label. */
public data class AllergyCodes(
    val severity: String? = null,
    val criticality: String? = null,
    val clinicalStatus: String? = null,
    val verificationStatus: String? = null,
)

/** The words for an item, in the order they are shown and spoken. */
public data class AllergyWords(
    val substance: String,
    val subject: String? = null,
    val reaction: String? = null,
    val severity: String? = null,
    val criticality: String? = null,
    val clinicalStatus: String? = null,
    val verificationStatus: String? = null,
    val type: String? = null,
    val category: String? = null,
    val updated: String? = null,
)

public object AllergyRules {
    /** Any status but known shows the status words as the list's one item. */
    public fun showsStatusItem(status: AllergyListStatus): Boolean = status != AllergyListStatus.Known

    /** The list's accessible name: the label, else the status words. */
    public fun listName(label: String?, statusLabel: String): String = if (label.isNullOrEmpty()) statusLabel else label

    public fun listWarnings(statusLabel: String?): List<String> =
        if (statusLabel.isNullOrEmpty()) listOf("AllergyRecordList: a statusLabel is required, so the list is never blank") else emptyList()

    /** A warning for each code given without its words. */
    public fun itemWarnings(codes: AllergyCodes, words: AllergyWords): List<String> = listOf(
        Triple("severity", codes.severity, words.severity),
        Triple("criticality", codes.criticality, words.criticality),
        Triple("clinicalStatus", codes.clinicalStatus, words.clinicalStatus),
        Triple("verificationStatus", codes.verificationStatus, words.verificationStatus),
    ).mapNotNull { (name, code, label) ->
        if (code != null && label.isNullOrEmpty()) "AllergyRecordListItem: $name $code needs its label, or it is shown as a code or a colour" else null
    }

    /** Everything an item says, in order, joined by line breaks; Lily adds no words. */
    public fun spoken(words: AllergyWords): String = listOf(
        words.subject, words.substance, words.reaction, words.severity, words.criticality, words.clinicalStatus,
        words.verificationStatus, words.type, words.category, words.updated,
    ).filterNotNull().filter { it.isNotEmpty() }.joinToString("\n")
}
