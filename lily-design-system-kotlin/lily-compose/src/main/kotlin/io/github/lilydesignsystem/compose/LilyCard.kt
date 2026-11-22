// LilyCard (components/card): a heading and content. Named LilyCard because Material 3 has a Card. Not one TalkBack stop by
// default; the heading is a heading(), and a `label` makes the card a named traversal group (the web's role="group" with
// aria-label). Compose has no heading levels. A linked card is not yet ported: put a clickable element in the content.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/**
 * @param heading the heading, in the app's language.
 * @param label names the card as a group.
 * @param content the card's body.
 */
@Composable
public fun LilyCard(
    modifier: Modifier = Modifier,
    heading: String? = null,
    label: String? = null,
    content: @Composable () -> Unit,
) {
    Column(
        modifier = modifier.semantics {
            if (label != null) {
                isTraversalGroup = true
                contentDescription = label
            }
        },
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        heading?.let { BasicText(it, style = LocalLilyTextStyles.current.heading, modifier = Modifier.semantics { heading() }) }
        content()
    }
}
