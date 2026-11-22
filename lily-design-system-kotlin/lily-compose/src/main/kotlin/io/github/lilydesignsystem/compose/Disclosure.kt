// Disclosure (components/details on Android, where foundation has no disclosure): a 48dp toggle named by its label that shows
// or hides its content, with expand and collapse semantics actions so TalkBack offers them.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.collapse
import androidx.compose.ui.semantics.expand
import androidx.compose.ui.semantics.semantics

/**
 * @param label the toggle's words, in the app's language.
 * @param initiallyOpen whether it starts open.
 * @param content shown while open.
 */
@Composable
public fun Disclosure(label: String, modifier: Modifier = Modifier, initiallyOpen: Boolean = false, content: @Composable () -> Unit) {
    var open by remember { mutableStateOf(initiallyOpen) }
    Column(modifier = modifier) {
        BasicText(
            label,
            style = LocalLilyTextStyles.current.strong,
            modifier = Modifier
                .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                .clickable(role = Role.Button) { open = !open }
                .semantics {
                    if (open) collapse { open = false; true } else expand { open = true; true }
                },
        )
        if (open) content()
    }
}
