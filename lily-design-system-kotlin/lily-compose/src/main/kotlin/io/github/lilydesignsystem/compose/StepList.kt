// StepList (components/step-list): the steps of a task and where the person is, each step saying its status in the app's words,
// never by colour or a tick alone (tasks.md P62-T3, shared/form-parts.ts).
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.LilyRangeException
import io.github.lilydesignsystem.core.StepStatus
import io.github.lilydesignsystem.core.stepStatus

/** Each step's status, by the shared rules; a current index out of range is a warning and every step waiting. */
public fun stepListStatuses(count: Int, current: Int): List<StepStatus> = try {
    (0 until count).map { stepStatus(it, current) }
} catch (_: LilyRangeException) {
    LilyWarnings.warn("StepList: current $current is not a step")
    List(count) { StepStatus.Waiting }
}

/**
 * @param label the list's spoken name ("Questions").
 * @param steps each step's name, in order.
 * @param current the current step's index, from 0.
 * @param statusLabel the words for each status ("Done", "Now", "To do"), spoken after the step's name.
 */
@Composable
public fun StepList(
    label: String,
    steps: List<String>,
    current: Int,
    statusLabel: (StepStatus) -> String,
    modifier: Modifier = Modifier,
) {
    val styles = LocalLilyTextStyles.current
    val statuses = stepListStatuses(steps.size, current)
    Column(modifier = modifier.semantics { contentDescription = label }, verticalArrangement = Arrangement.spacedBy(6.dp)) {
        steps.forEachIndexed { index, name ->
            val status = statuses[index]
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.clearAndSetSemantics {
                    contentDescription = LilySemantics.spoken(name, statusLabel(status)).orEmpty()
                    selected = status == StepStatus.InProgress
                },
            ) {
                BasicText(name, style = if (status == StepStatus.InProgress) styles.body.copy(fontWeight = FontWeight.Bold) else styles.body)
                BasicText(statusLabel(status), style = styles.small)
            }
        }
    }
}
