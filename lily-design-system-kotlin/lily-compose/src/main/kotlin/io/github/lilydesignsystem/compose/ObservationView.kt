// ObservationView (components/observation-view): a clinical result with its unit, flag, reference range, status and an
// optional meter. The rules are lily-core's ObservationRules; the view is one TalkBack stop that speaks them in order. The
// meter bar is the picture of the words and hidden from TalkBack; the flag's meaning is in its words, never its colour.
package io.github.lilydesignsystem.compose

import android.util.Log
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.MeterReading
import io.github.lilydesignsystem.core.NamedRange
import io.github.lilydesignsystem.core.ObservationRules
import io.github.lilydesignsystem.core.ObservationStatus

/**
 * @param value the value, formatted by the app ("5.2").
 * @param unit the unit ("mmol/L"); joined to the value by a no-break space.
 * @param interpretation a FHIR v3 ObservationInterpretation code ("N", "H", "LL"); for styling only, never shown.
 * @param flagLabel the flag in the app's words ("High"); required when the interpretation is not "N".
 * @param range the reference range as text; [ranges] are further named ranges.
 * @param status a FHIR status or a Lily absence; default [ObservationStatus.Final].
 * @param statusLabel the status in words; required for any status but final: without them nothing of the result is shown.
 * @param showWithdrawn for an authorised history view: an entered-in-error result's former value, struck through after its words.
 * @param previousValue a superseded value, struck through; [previousLabel] is the words for it ("was 5.1 until 3 Nov").
 * @param label spoken first, when no visible caption names the observation.
 * @param meter the value on its scale ([MeterReading], which refuses a value off the scale), for a bar hidden from TalkBack.
 * @param meterColor the bar's colour; the track is drawn in the same colour at a lower alpha.
 */
@Composable
public fun ObservationView(
    modifier: Modifier = Modifier,
    value: String? = null,
    unit: String? = null,
    interpretation: String? = null,
    flagLabel: String? = null,
    range: String? = null,
    ranges: List<NamedRange> = emptyList(),
    status: ObservationStatus = ObservationStatus.Final,
    statusLabel: String? = null,
    previousValue: String? = null,
    previousLabel: String? = null,
    label: String? = null,
    meter: MeterReading? = null,
    meterColor: Color = Color.Gray,
    showWithdrawn: Boolean = false,
) {
    ObservationRules.warnings(interpretation, flagLabel, status, statusLabel, previousValue, previousLabel)
        .forEach { LilyWarnings.warn(it) }
    val styles = LocalLilyTextStyles.current
    val replaced = ObservationRules.withholds(status, statusLabel, showWithdrawn)
    val withdrawn = ObservationRules.isWithdrawn(status)
    val shown = if (replaced || withdrawn) statusLabel else ObservationRules.shownValue(value, unit, status)
    val spoken = ObservationRules.spoken(
        label, value, unit, flagLabel, interpretation, range, ranges, status, statusLabel, previousLabel,
        showWithdrawn,
    )
    Column(
        modifier = modifier.clearAndSetSemantics { contentDescription = spoken },
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            shown?.let { BasicText(it, style = styles.strong) }
            if (withdrawn && !replaced) {
                ObservationRules.shownValue(value, unit, status)?.let {
                    BasicText(it, style = styles.body.merge(TextStyle(textDecoration = TextDecoration.LineThrough)))
                }
            }
            if (replaced || withdrawn) return@Row
            if (ObservationRules.isFlagged(interpretation)) flagLabel?.let { BasicText(it, style = styles.body) }
            if (ObservationRules.showsStatus(status)) statusLabel?.let { BasicText(it, style = styles.body) }
        }
        if (replaced || withdrawn) return@Column
        if (previousValue != null) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                BasicText(previousValue, style = styles.body.merge(TextStyle(textDecoration = TextDecoration.LineThrough)))
                previousLabel?.let { BasicText(it, style = styles.small) }
            }
        }
        range?.let { BasicText(it, style = styles.small) }
        ranges.forEach { BasicText(it.label + " " + it.text, style = styles.small) }
        if (meter != null) {
            val fraction = ((meter.value - meter.scale.min) / (meter.scale.max - meter.scale.min)).toFloat()
            Canvas(Modifier.fillMaxWidth().height(8.dp)) {
                drawRect(meterColor.copy(alpha = 0.25f), Offset.Zero, size)
                drawRect(meterColor, Offset.Zero, Size(size.width * fraction, size.height))
            }
        }
    }
}

/** Development warnings, for the developer, never shown to the user (the web's dev-warning). */
public object LilyWarnings {
    /** Set false to silence them, as `globalThis.lilyWarnings = false` does on the web. */
    public var enabled: Boolean = true

    internal fun warn(message: String) {
        if (enabled) Log.w("Lily", message)
    }
}
