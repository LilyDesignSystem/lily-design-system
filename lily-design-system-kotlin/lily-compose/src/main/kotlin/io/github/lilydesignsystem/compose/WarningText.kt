// WarningText (components/warning-text). On the web the kind of message ("Warning") is visually hidden text; Android has
// none, so it is a required `prefix`, spoken before the warning as one TalkBack stop. Lily supplies neither word.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.unit.dp

/**
 * @param prefix the kind of message, spoken first ("Warning"), in the app's language. Required.
 * @param text the warning, in the app's language.
 * @param icon a decorative icon; hidden from TalkBack.
 */
@Composable
public fun WarningText(
    prefix: String,
    text: String,
    modifier: Modifier = Modifier,
    icon: (@Composable () -> Unit)? = null,
) {
    Row(
        modifier = modifier.clearAndSetSemantics { contentDescription = LilySemantics.spoken(prefix, text) ?: text },
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.Top,
    ) {
        icon?.invoke()
        BasicText(text, style = LocalLilyTextStyles.current.strong)
    }
}
