// LilyBadge (components/badge): a short status, a polite live region as the web's role="status". Named LilyBadge because
// Material 3 has a Badge (mobile/components-mobile.tsv). `label` replaces the spoken text when the text needs context.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion

public enum class BadgeKind { Default, Info, Success, Warning, Error }

/**
 * @param text the visible text ("3", "New"), in the app's language.
 * @param kind the variant, for the caller's styling; never spoken.
 * @param label spoken instead of the text when the text alone lacks context ("3 unread messages").
 */
@Composable
public fun LilyBadge(
    text: String,
    modifier: Modifier = Modifier,
    @Suppress("UNUSED_PARAMETER") kind: BadgeKind = BadgeKind.Default,
    label: String? = null,
) {
    BasicText(
        text,
        style = LocalLilyTextStyles.current.strong,
        modifier = modifier.clearAndSetSemantics {
            contentDescription = LilySemantics.badgeLabel(text, label)
            liveRegion = LiveRegionMode.Polite
        },
    )
}
