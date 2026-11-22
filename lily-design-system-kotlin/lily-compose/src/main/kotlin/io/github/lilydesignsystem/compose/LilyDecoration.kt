// How a theme draws the lily-compose components: the Compose form of Swift's style protocols. A component applies its
// decoration after its own semantics, so a theme changes how it looks, never what TalkBack reads. The default draws nothing;
// lily-compose-themes provides one from a theme's tokens (LilyTheme), as the web keeps themes out of the headless layer.
package io.github.lilydesignsystem.compose

import androidx.compose.runtime.ProvidableCompositionLocal
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color

public interface LilyDecoration {
    /** The alert's container, for its severity. */
    public fun alert(kind: AlertKind): Modifier

    /** The badge's container, for its kind. */
    public fun badge(kind: BadgeKind): Modifier

    /** The badge's text colour, paired with its container; Unspecified keeps the text style's colour. */
    public fun badgeText(kind: BadgeKind): Color

    /** The tag's container. */
    public fun tag(): Modifier

    /** The card's container. */
    public fun card(): Modifier

    /** The inset text's container. */
    public fun insetText(): Modifier
}

/** Draws nothing: the platform's text and no decoration. */
public object PlainDecoration : LilyDecoration {
    override fun alert(kind: AlertKind): Modifier = Modifier

    override fun badge(kind: BadgeKind): Modifier = Modifier

    override fun badgeText(kind: BadgeKind): Color = Color.Unspecified

    override fun tag(): Modifier = Modifier

    override fun card(): Modifier = Modifier

    override fun insetText(): Modifier = Modifier
}

public val LocalLilyDecoration: ProvidableCompositionLocal<LilyDecoration> = staticCompositionLocalOf { PlainDecoration }
