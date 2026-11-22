// AllergyRecordList and AllergyRecordListItem (components/allergy-record-list*). The list is a labelled traversal group that
// is never blank: for any status but known its status words are its one item. Each item's record is one TalkBack stop
// speaking lily-core's AllergyRules in order, whose record it is first; extra content follows as its own stops.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.AllergyCodes
import io.github.lilydesignsystem.core.AllergyListStatus
import io.github.lilydesignsystem.core.AllergyRules
import io.github.lilydesignsystem.core.AllergyWords

/**
 * @param status known, none known, not recorded, unavailable, omitted or not applicable. Required.
 * @param statusLabel the status in words ("No known allergies"); names the list, and is its one item unless known.
 * @param label the list's name, when it should differ from the status words.
 * @param content [AllergyRecordListItem]s, shown when the status is known.
 */
@Composable
public fun AllergyRecordList(
    status: AllergyListStatus,
    statusLabel: String,
    modifier: Modifier = Modifier,
    label: String? = null,
    content: @Composable () -> Unit = {},
) {
    AllergyRules.listWarnings(statusLabel).forEach { LilyWarnings.warn(it) }
    Column(
        modifier = modifier.semantics {
            isTraversalGroup = true
            contentDescription = AllergyRules.listName(label, statusLabel)
        },
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        if (AllergyRules.showsStatusItem(status)) BasicText(statusLabel, style = LocalLilyTextStyles.current.body) else content()
    }
}

/**
 * @param words the substance and every part's words, in the app's language.
 * @param codes the FHIR codes, when there are any; each needs its words in [words], or a development warning is raised.
 * @param extra anything else, such as a link to the full record; its own TalkBack stops.
 */
@Composable
public fun AllergyRecordListItem(
    words: AllergyWords,
    modifier: Modifier = Modifier,
    codes: AllergyCodes? = null,
    extra: @Composable () -> Unit = {},
) {
    AllergyRules.itemWarnings(codes ?: AllergyCodes(), words).forEach { LilyWarnings.warn(it) }
    val styles = LocalLilyTextStyles.current
    val details = listOf(
        words.reaction, words.severity, words.criticality, words.clinicalStatus, words.verificationStatus, words.type,
        words.category, words.updated,
    ).filterNotNull().filter { it.isNotEmpty() }
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Column(
            modifier = Modifier.clearAndSetSemantics { contentDescription = AllergyRules.spoken(words) },
            verticalArrangement = Arrangement.spacedBy(2.dp),
        ) {
            words.subject?.let { BasicText(it, style = styles.small) }
            BasicText(words.substance, style = styles.strong, softWrap = true)
            details.forEach { BasicText(it, style = styles.body) }
        }
        extra()
    }
}
