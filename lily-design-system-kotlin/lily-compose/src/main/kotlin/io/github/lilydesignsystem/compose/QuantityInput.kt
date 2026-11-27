// QuantityInput (components/quantity-input-div): a number and its unit, such as a weight in kilograms or pounds, in a labelled
// group. Each unit carries its own limits; quantityInputProblem says what is wrong with the number as typed. Foundation has no
// dropdown, so the units are a radio group (tasks.md P62-T3).
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.QuantityProblem
import io.github.lilydesignsystem.core.quantityProblem

/** One unit a quantity may be given in, with the limits a number in it must keep to. */
public data class QuantityUnit(val value: String, val label: String, val min: Double? = null, val max: Double? = null)

/** What is wrong with [magnitude] in [unit], or null; an unknown unit has no limits. */
public fun quantityInputProblem(magnitude: String, unit: String, units: List<QuantityUnit>): QuantityProblem? {
    val chosen = units.firstOrNull { it.value == unit }
    return quantityProblem(magnitude, chosen?.min, chosen?.max)
}

/**
 * @param label names the quantity ("Your weight").
 * @param magnitudeLabel the number field's label ("Weight").
 * @param unitLabel the unit group's label ("Weight unit"); needed when there is more than one unit.
 * @param units the units offered, each with its limits.
 * @param magnitude the number as typed, with a full stop for its decimal mark.
 * @param unit the chosen unit's value.
 * @param error the error; set as the number's error semantics.
 */
@Composable
public fun QuantityInput(
    label: String,
    magnitudeLabel: String,
    units: List<QuantityUnit>,
    magnitude: String,
    onMagnitudeChange: (String) -> Unit,
    unit: String,
    onUnitChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    unitLabel: String? = null,
    error: String? = null,
) {
    val styles = LocalLilyTextStyles.current
    val chosen = units.firstOrNull { it.value == unit } ?: units.firstOrNull()
    LaunchedEffect(units.size, unitLabel) {
        if (units.size > 1 && unitLabel.isNullOrEmpty()) LilyWarnings.warn("QuantityInput: the unit choice needs a unitLabel")
    }
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(4.dp)) {
        BasicText(label, style = styles.body, modifier = Modifier.clearAndSetSemantics {})
        if (!error.isNullOrEmpty()) BasicText(error, style = styles.strong, modifier = Modifier.clearAndSetSemantics {})
        BasicText(magnitudeLabel, style = styles.small, modifier = Modifier.clearAndSetSemantics {})
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            BasicTextField(
                value = magnitude,
                onValueChange = onMagnitudeChange,
                singleLine = true,
                textStyle = styles.body,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                modifier = Modifier
                    .width(120.dp)
                    .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                    .then(LocalLilyDecoration.current.field())
                    .semantics {
                        contentDescription = LilySemantics.spoken(label, magnitudeLabel, if (units.size == 1) chosen?.label else null).orEmpty()
                        if (!error.isNullOrEmpty()) error(error)
                    },
            )
            if (units.size == 1) BasicText(chosen?.label.orEmpty(), style = styles.body, modifier = Modifier.clearAndSetSemantics {})
        }
        if (units.size > 1) {
            BasicText(unitLabel.orEmpty(), style = styles.small, modifier = Modifier.clearAndSetSemantics {})
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.selectableGroup().semantics { contentDescription = unitLabel.orEmpty() },
            ) {
                units.forEach { option ->
                    val selected = option.value == unit
                    BasicText(
                        option.label,
                        style = if (selected) styles.body.copy(fontWeight = FontWeight.Bold) else styles.body,
                        modifier = Modifier
                            .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                            .selectable(selected = selected, role = Role.RadioButton) { onUnitChange(option.value) },
                    )
                }
            }
        }
    }
}
