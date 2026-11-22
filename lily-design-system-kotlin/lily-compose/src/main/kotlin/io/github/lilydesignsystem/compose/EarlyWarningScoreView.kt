// EarlyWarningScoreView (components/early-warning-score-view): a score the app computed, its system, band and what to do. One
// TalkBack stop; the band's words are always shown and spoken, and a band without words raises a development warning.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.EarlyWarningScoreRules

/**
 * @param score the score the app's validated code computed.
 * @param system the scoring system's name ("NEWS2").
 * @param band the app's band key, for the caller's styling; [bandLabel] (its words) is required with it.
 * @param escalation what to do, in the app's words.
 * @param label spoken first, naming the value.
 */
@Composable
public fun EarlyWarningScoreView(
    score: String,
    modifier: Modifier = Modifier,
    system: String? = null,
    band: String? = null,
    bandLabel: String? = null,
    escalation: String? = null,
    label: String? = null,
) {
    EarlyWarningScoreRules.warnings(band, bandLabel).forEach { LilyWarnings.warn(it) }
    val styles = LocalLilyTextStyles.current
    Column(
        modifier = modifier.clearAndSetSemantics {
            contentDescription = EarlyWarningScoreRules.spoken(label, system, score, bandLabel, escalation)
        },
        verticalArrangement = Arrangement.spacedBy(2.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            system?.let { BasicText(it, style = styles.body) }
            BasicText(score, style = styles.strong)
            bandLabel?.let { BasicText(it, style = styles.body) }
        }
        escalation?.let { BasicText(it, style = styles.body) }
    }
}
