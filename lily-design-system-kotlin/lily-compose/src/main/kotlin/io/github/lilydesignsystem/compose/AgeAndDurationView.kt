// AgeView and DurationView (components/age-view, components/duration-view): an age or a length of time in the app's words.
// Lily writes no unit words: format lily-core's ageParts or durationParts with the platform's MeasureFormat or the app's own
// labels. Each is one TalkBack stop, the optional label spoken first.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import io.github.lilydesignsystem.core.HtmlDuration
import io.github.lilydesignsystem.core.htmlDuration

/**
 * @param value the age as the app writes it ("5 years 2 months").
 * @param duration the same age as an ISO 8601 duration (`toIsoDuration(ageParts(…))`), for the app's own use.
 * @param label spoken first, naming the value ("Age").
 */
@Composable
public fun AgeView(value: String, modifier: Modifier = Modifier, @Suppress("UNUSED_PARAMETER") duration: String? = null, label: String? = null) {
    BasicText(
        value,
        style = LocalLilyTextStyles.current.body,
        modifier = modifier.clearAndSetSemantics { contentDescription = LilySemantics.spoken(label, value) ?: value },
    )
}

/**
 * @param value the length of time as the app writes it ("3 days early"); the direction is in these words.
 * @param duration the same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative; an
 *   invalid one raises a development warning.
 * @param label spoken first, naming the value.
 */
@Composable
public fun DurationView(value: String, duration: String, modifier: Modifier = Modifier, label: String? = null) {
    durationWarnings(duration).forEach { LilyWarnings.warn(it) }
    BasicText(
        value,
        style = LocalLilyTextStyles.current.body,
        modifier = modifier.clearAndSetSemantics { contentDescription = LilySemantics.spoken(label, value) ?: value },
    )
}

/** The parsed duration, as the web renders `datetime` and `data-negative`; null when it is not a valid day-time duration. */
public fun parsedDuration(duration: String): HtmlDuration? = htmlDuration(duration)

internal fun durationWarnings(duration: String): List<String> =
    if (htmlDuration(duration) == null) {
        listOf("DurationView: $duration is not an ISO 8601 duration of days, hours, minutes and seconds")
    } else {
        emptyList()
    }
