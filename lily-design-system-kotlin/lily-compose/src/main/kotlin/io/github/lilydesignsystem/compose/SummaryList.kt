// SummaryList and SummaryListItem (components/summary-list): labelled term-and-value pairs. Each item is one TalkBack stop,
// term then value; the list is a labelled traversal group. The plain look stacks the value under the term, so nothing is
// cut off at a large font scale or a narrow window.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/**
 * @param label the list's spoken name, in the app's language.
 * @param content [SummaryListItem]s.
 */
@Composable
public fun SummaryList(label: String, modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    Column(
        modifier = modifier.semantics {
            isTraversalGroup = true
            contentDescription = label
        },
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) { content() }
}

/**
 * @param term the key, in the app's language.
 * @param value the value; a missing value should be the app's words, never a dash.
 */
@Composable
public fun SummaryListItem(term: String, modifier: Modifier = Modifier, value: @Composable () -> Unit) {
    Column(
        modifier = modifier.semantics(mergeDescendants = true) {},
        verticalArrangement = Arrangement.spacedBy(2.dp),
    ) {
        BasicText(term, style = LocalLilyTextStyles.current.strong)
        value()
    }
}
