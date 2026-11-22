// Tag (components/tag): a label on an item ("High", "Draft"). Not live by default. The required `label` gives the context the
// visible text lacks, spoken after it; with `live`, the label is the spoken name, the text its state, and changes are polite.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.stateDescription

/**
 * @param text the visible text, in the app's language.
 * @param label the context, in the app's language; spoken after the text, or as the name when [live]. Required.
 * @param live announce changes of the text politely, for a tag whose text changes in place.
 */
@Composable
public fun Tag(text: String, label: String, modifier: Modifier = Modifier, live: Boolean = false) {
    BasicText(
        text,
        style = LocalLilyTextStyles.current.small,
        modifier = modifier.clearAndSetSemantics {
            contentDescription = LilySemantics.tagLabel(text, label, live)
            if (live) {
                stateDescription = text
                liveRegion = LiveRegionMode.Polite
            }
        }.then(LocalLilyDecoration.current.tag()),
    )
}
