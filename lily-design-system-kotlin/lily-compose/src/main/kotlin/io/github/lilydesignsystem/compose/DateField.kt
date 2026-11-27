// DateField (components/date-field): a date asked for as typed parts, day, month and year, in the reader's order, in a labelled
// group. Easier than a calendar for a date a person knows by heart. The value is ISO 8601 once every part is a number, else "";
// whether it is a real day is isCalendarDate's, and the app's to say (tasks.md P62-T3, shared/form-parts.ts).
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.DateFieldOrder
import io.github.lilydesignsystem.core.DateFieldPart
import io.github.lilydesignsystem.core.DateFieldPrecision
import io.github.lilydesignsystem.core.DateParts
import io.github.lilydesignsystem.core.dateSequence
import io.github.lilydesignsystem.core.datePartsShown
import io.github.lilydesignsystem.core.joinDateParts
import io.github.lilydesignsystem.core.splitDateValue

/**
 * @param label names the whole date ("Date of birth"); spoken before each part's label.
 * @param partLabels each part's label, in the app's language; only those [precision] asks for are needed.
 * @param order the order the reader writes a date in; the app's, never assumed.
 * @param value YYYY-MM-DD, YYYY-MM or YYYY once its parts are numbers, else "".
 * @param onValueChange called with the new value as the parts are typed.
 * @param description help text, such as an example date, spoken after the label.
 * @param error the error; set as each part's error semantics, which TalkBack reads.
 */
@Composable
public fun DateField(
    label: String,
    partLabels: Map<DateFieldPart, String>,
    order: DateFieldOrder,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    precision: DateFieldPrecision = DateFieldPrecision.Day,
    description: String? = null,
    error: String? = null,
) {
    val styles = LocalLilyTextStyles.current
    val decoration = LocalLilyDecoration.current
    var parts by remember { mutableStateOf(splitDateValue(value, precision)) }
    // A value set from outside fills the parts; one the parts produced leaves them as typed.
    LaunchedEffect(value) { if (value != joinDateParts(parts, precision)) parts = splitDateValue(value, precision) }
    LaunchedEffect(precision, partLabels) { dateFieldWarnings(precision, partLabels).forEach { LilyWarnings.warn(it) } }
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(4.dp)) {
        BasicText(label, style = styles.body, modifier = Modifier.clearAndSetSemantics {})
        description?.let { BasicText(it, style = styles.small, modifier = Modifier.clearAndSetSemantics {}) }
        if (!error.isNullOrEmpty()) BasicText(error, style = styles.strong, modifier = Modifier.clearAndSetSemantics {})
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            dateSequence(order, precision).forEach { part ->
                val partLabel = partLabels[part].orEmpty()
                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    BasicText(partLabel, style = styles.small, modifier = Modifier.clearAndSetSemantics {})
                    BasicTextField(
                        value = parts[part],
                        onValueChange = { text ->
                            val kept = text.take(if (part == DateFieldPart.Year) 4 else 2)
                            parts = when (part) {
                                DateFieldPart.Year -> parts.copy(year = kept)
                                DateFieldPart.Month -> parts.copy(month = kept)
                                DateFieldPart.Day -> parts.copy(day = kept)
                            }
                            onValueChange(joinDateParts(parts, precision))
                        },
                        singleLine = true,
                        textStyle = styles.body,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier
                            .width(if (part == DateFieldPart.Year) 72.dp else 52.dp)
                            .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                            .then(decoration.field())
                            .semantics {
                                contentDescription = LilySemantics.spoken(label, partLabel, description).orEmpty()
                                if (!error.isNullOrEmpty()) error(error)
                            },
                    )
                }
            }
        }
    }
}

/** Words a part needs but was not given, for a development warning. */
public fun dateFieldWarnings(precision: DateFieldPrecision, partLabels: Map<DateFieldPart, String>): List<String> =
    datePartsShown(precision).filter { partLabels[it].isNullOrEmpty() }.map { "DateField: the ${it.key} part needs a label" }

/** The parts of [value] at [precision], for an app that shows them elsewhere. */
public fun dateFieldParts(value: String, precision: DateFieldPrecision): DateParts = splitDateValue(value, precision)
