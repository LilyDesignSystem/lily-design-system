// LilyAlert (components/alert): a message with a severity, in a live region (the mobile form of role="alert" / role="status").
// The severity is exposed to the caller's styling, never spoken by Lily: say it in the heading or message if it matters.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.unit.dp

public enum class AlertKind { Info, Success, Warning, Error }

/**
 * @param message the message, in the app's language.
 * @param kind the severity, for the caller's styling (the web's `data-type`); never the only cue.
 * @param heading an optional heading, in the app's language.
 * @param politeness [Politeness.Assertive] by default, as `role="alert"`.
 */
@Composable
public fun LilyAlert(
    message: String,
    modifier: Modifier = Modifier,
    kind: AlertKind = AlertKind.Info,
    heading: String? = null,
    politeness: Politeness = Politeness.Assertive,
) {
    val styles = LocalLilyTextStyles.current
    Column(
        modifier = modifier.clearAndSetSemantics {
            contentDescription = LilySemantics.spoken(heading, message) ?: message
            LilySemantics.liveRegion(politeness)?.let { liveRegion = it }
        },
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        heading?.let { BasicText(it, style = styles.strong) }
        BasicText(message, style = styles.body)
    }
}
