// RepeatableFieldset (components/repeatable-fieldset): the "add another" pattern, a question answered with a list of the same
// fields, such as each medicine a person takes. Each item is a named group with its remove button; the add button follows the
// list. A change is announced politely, in the app's words, when given (tasks.md P62-T3, shared/form-parts.ts).
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.disabled
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.core.LilyRangeException
import io.github.lilydesignsystem.core.canAddItem
import io.github.lilydesignsystem.core.canRemoveItem

/** Whether another item may be added and one removed, by the shared rules; limits out of range are a warning and a no. */
public fun repeatableAllowed(count: Int, min: Int, max: Int?): Pair<Boolean, Boolean> = try {
    canAddItem(count, max) to canRemoveItem(count, min)
} catch (e: LilyRangeException) {
    LilyWarnings.warn("RepeatableFieldset: ${e.reason} is not a whole number")
    false to false
}

/**
 * @param legend names the whole list ("Your medicines").
 * @param items the app's items.
 * @param onItemsChange called with the list after an add or a remove.
 * @param newItem makes an item when the add button is pressed.
 * @param itemLegend each item's name, from 1 ("Medicine 2").
 * @param addLabel the add button's words.
 * @param removeLabel each remove button's words, from 1.
 * @param min the fewest items: the remove buttons go at it. [max] the most: the add button is disabled at it.
 * @param addedLabel, removedLabel what is announced after an add or a remove, from 1.
 * @param item one item's fields, given the item and its index from 0.
 */
@Composable
public fun <T> RepeatableFieldset(
    legend: String,
    items: List<T>,
    onItemsChange: (List<T>) -> Unit,
    newItem: () -> T,
    itemLegend: (Int) -> String,
    addLabel: String,
    removeLabel: (Int) -> String,
    modifier: Modifier = Modifier,
    min: Int = 0,
    max: Int? = null,
    addedLabel: ((Int) -> String)? = null,
    removedLabel: ((Int) -> String)? = null,
    item: @Composable (T, Int) -> Unit,
) {
    val styles = LocalLilyTextStyles.current
    val (canAdd, canRemove) = repeatableAllowed(items.size, min, max)
    var status by remember { mutableStateOf("") }
    Column(modifier = modifier.semantics { contentDescription = legend }, verticalArrangement = Arrangement.spacedBy(12.dp)) {
        BasicText(legend, style = styles.strong, modifier = Modifier.semantics { heading() })
        items.forEachIndexed { index, entry ->
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                BasicText(itemLegend(index + 1), style = styles.strong, modifier = Modifier.semantics { heading() })
                item(entry, index)
                if (canRemove) {
                    BasicText(
                        removeLabel(index + 1),
                        style = styles.body,
                        modifier = Modifier.defaultMinSize(minHeight = LilyMinimumTouchTarget).clickable(role = Role.Button) {
                            onItemsChange(items.filterIndexed { i, _ -> i != index })
                            status = removedLabel?.invoke(index + 1).orEmpty()
                        },
                    )
                }
            }
        }
        BasicText(
            addLabel,
            style = styles.body,
            modifier = Modifier
                .defaultMinSize(minHeight = LilyMinimumTouchTarget)
                .clickable(enabled = canAdd, role = Role.Button) {
                    onItemsChange(items + newItem())
                    status = addedLabel?.invoke(items.size + 1).orEmpty()
                }
                .semantics { if (!canAdd) disabled() },
        )
        if (addedLabel != null || removedLabel != null) {
            BasicText(status, style = styles.small, modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite })
        }
    }
}
