// RecordList and RecordListItem (components/record-list*): the shape every clinical list shares. On mobile the medication,
// problem, immunisation, procedure and device lists are this list with a Lily view as each item's content
// (mobile/components-mobile.tsv: pattern). Each item is one TalkBack stop, read in order: whose record, the entry state, the
// content (unless withheld), the status, the update. A record entered in error is struck through: the item provides
// LocalLilyTextStyles with a line-through, so every Lily view inside draws its text that way.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.RecordEntryState
import io.github.lilydesignsystem.core.RecordListStatus
import io.github.lilydesignsystem.core.RecordRules

/**
 * @param status known, none known, not recorded, unavailable, omitted or not applicable. Required.
 * @param statusLabel the status in words; names the list, and is its one item unless known.
 * @param coverageLabel what the list is a view of (its window, its order, what is left out), shown first.
 */
@Composable
public fun RecordList(
    status: RecordListStatus,
    statusLabel: String,
    modifier: Modifier = Modifier,
    label: String? = null,
    coverageLabel: String? = null,
    content: @Composable () -> Unit = {},
) {
    RecordRules.listWarnings(statusLabel).forEach { LilyWarnings.warn(it) }
    val styles = LocalLilyTextStyles.current
    Column(
        modifier = modifier.semantics {
            isTraversalGroup = true
            contentDescription = RecordRules.listName(label, statusLabel)
        },
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        coverageLabel?.let { BasicText(it, style = styles.small) }
        if (RecordRules.showsStatusItem(status)) BasicText(statusLabel, style = styles.body) else content()
    }
}

/**
 * @param subjectLabel whose record it is, when it is not the patient's ("Mother"); first.
 * @param status the record's status as the app's code; [statusLabel] is its words (required with a code).
 * @param entryState withheld (only [entryStateLabel] is shown) or entered in error (struck through, with the words).
 * @param content the record itself, usually a Lily view.
 */
@Composable
public fun RecordListItem(
    modifier: Modifier = Modifier,
    subjectLabel: String? = null,
    status: String? = null,
    statusLabel: String? = null,
    updatedLabel: String? = null,
    entryState: RecordEntryState? = null,
    entryStateLabel: String? = null,
    content: @Composable () -> Unit,
) {
    RecordRules.itemWarnings(status, statusLabel, entryState, entryStateLabel).forEach { LilyWarnings.warn(it) }
    val styles = LocalLilyTextStyles.current
    Column(
        modifier = modifier.semantics(mergeDescendants = true) {},
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        subjectLabel?.let { BasicText(it, style = styles.small) }
        if (entryState != null) entryStateLabel?.let { BasicText(it, style = styles.strong) }
        if (RecordRules.showsContent(entryState)) {
            if (RecordRules.strikesContent(entryState)) {
                val strike = TextStyle(textDecoration = TextDecoration.LineThrough)
                CompositionLocalProvider(
                    LocalLilyTextStyles provides LilyTextStyles(
                        body = styles.body.merge(strike),
                        strong = styles.strong.merge(strike),
                        heading = styles.heading.merge(strike),
                        small = styles.small.merge(strike),
                    ),
                    content = content,
                )
            } else {
                content()
            }
        }
        statusLabel?.let { BasicText(it, style = styles.body) }
        updatedLabel?.let { BasicText(it, style = styles.small) }
    }
}
