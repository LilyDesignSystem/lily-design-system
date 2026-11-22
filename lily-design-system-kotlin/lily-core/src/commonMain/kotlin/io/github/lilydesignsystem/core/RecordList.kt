// The rules of record-list and record-list-item, the twin of LilyCore's RecordRules in Swift. A list is never blank; a
// withheld record shows only its state words; one entered in error keeps its content, struck through; neither is removed.
package io.github.lilydesignsystem.core

public enum class RecordListStatus(public val key: String) {
    Known("known"), NoneKnown("none-known"), NotRecorded("not-recorded"), Unavailable("unavailable"), Omitted("omitted"),
    NotApplicable("not-applicable"),
}

public enum class RecordEntryState(public val key: String) { Withheld("withheld"), EnteredInError("entered-in-error") }

public object RecordRules {
    public fun showsStatusItem(status: RecordListStatus): Boolean = status != RecordListStatus.Known

    public fun listName(label: String?, statusLabel: String): String = if (label.isNullOrEmpty()) statusLabel else label

    /** Whether the record's content is shown: never for a withheld record. */
    public fun showsContent(entryState: RecordEntryState?): Boolean = entryState != RecordEntryState.Withheld

    /** Whether the content is struck through: a record entered in error. */
    public fun strikesContent(entryState: RecordEntryState?): Boolean = entryState == RecordEntryState.EnteredInError

    public fun listWarnings(statusLabel: String?): List<String> =
        if (statusLabel.isNullOrEmpty()) listOf("RecordList: a statusLabel is required, so the list is never blank") else emptyList()

    public fun itemWarnings(
        status: String?,
        statusLabel: String?,
        entryState: RecordEntryState?,
        entryStateLabel: String?,
    ): List<String> = buildList {
        if (!status.isNullOrEmpty() && statusLabel.isNullOrEmpty()) {
            add("RecordListItem: status $status needs a statusLabel, or it is shown as a code or a colour")
        }
        if (entryState != null && entryStateLabel.isNullOrEmpty()) {
            add("RecordListItem: entryState ${entryState.key} needs an entryStateLabel")
        }
    }
}
