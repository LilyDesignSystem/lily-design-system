// InsetText (components/inset-text): supplementary text set apart (the web's role="note"), read as one TalkBack stop.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

@Composable
public fun InsetText(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    Box(modifier = modifier.semantics(mergeDescendants = true) {}.padding(start = 12.dp)) { content() }
}
