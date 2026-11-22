// ErrorSummary (components/error-summary): the problems with a form, shown at the top after a failed submit. On the web it is
// role="alert" and takes focus; here its title is a heading that takes focus when the summary appears (TalkBack follows it),
// and each problem is a button that runs the app's action, which should focus the field (a FocusRequester) and scroll to it.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.isTraversalGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

/** One problem: what is wrong, in the app's words, and what to do when it is chosen (focus the field). */
public data class Problem(val message: String, val onClick: () -> Unit)

/**
 * @param title the heading ("There is a problem"), in the app's language.
 * @param problems the problems, in the order of the fields.
 * @param focusOnAppear focus the title when the summary appears (default true, as the web focuses it).
 */
@Composable
public fun ErrorSummary(
    title: String,
    problems: List<Problem>,
    modifier: Modifier = Modifier,
    focusOnAppear: Boolean = true,
) {
    val styles = LocalLilyTextStyles.current
    val titleFocus = remember { FocusRequester() }
    Column(
        modifier = modifier.semantics { isTraversalGroup = true },
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        BasicText(
            title,
            style = styles.heading,
            modifier = Modifier.focusRequester(titleFocus).focusable().semantics { heading() },
        )
        problems.forEach { problem ->
            BasicText(
                problem.message,
                style = styles.body,
                modifier = Modifier
                    .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                    .clickable(role = Role.Button, onClick = problem.onClick),
            )
        }
    }
    if (focusOnAppear) LaunchedEffect(Unit) { titleFocus.requestFocus() }
}
