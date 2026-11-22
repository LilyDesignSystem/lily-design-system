// LilyTheme: the lily-compose components drawn with a theme's tokens. Text uses only the pairs the web gates at 4.5:1 (a fill
// with its own -content, base text on the base surfaces); a severity colour is a rail or a border, never text
// (AGENTS/theme.md, colour pairs).
package io.github.lilydesignsystem.compose.themes

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ProvidableCompositionLocal
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.dp
import io.github.lilydesignsystem.compose.AlertKind
import io.github.lilydesignsystem.compose.BadgeKind
import io.github.lilydesignsystem.compose.LilyDecoration
import io.github.lilydesignsystem.compose.LilyTextStyles
import io.github.lilydesignsystem.compose.LocalLilyDecoration
import io.github.lilydesignsystem.compose.LocalLilyTextStyles

/** The tokens in use; [LilyTokens.light] unless a [LilyTheme] sets others. */
public val LocalLilyTokens: ProvidableCompositionLocal<LilyTokens> = staticCompositionLocalOf { LilyTokens.light }

/** Draws every lily-compose component inside [content] with [tokens]. Light and dark are the app's choice. */
@Composable
public fun LilyTheme(tokens: LilyTokens, content: @Composable () -> Unit) {
    val styles = LilyTextStyles()
    val text = TextStyle(color = tokens.baseContent)
    CompositionLocalProvider(
        LocalLilyTokens provides tokens,
        LocalLilyDecoration provides TokenDecoration(tokens),
        LocalLilyTextStyles provides LilyTextStyles(
            body = styles.body.merge(text),
            strong = styles.strong.merge(text),
            heading = styles.heading.merge(text),
            small = styles.small.merge(text),
        ),
        content = content,
    )
}

/** A fill and the text colour that pairs with it. */
public data class ColorPair(val fill: Color, val text: Color)

/** The decoration [LilyTheme] provides, from [tokens]. */
public class TokenDecoration(private val tokens: LilyTokens) : LilyDecoration {
    /** The gated pair for a severity. */
    public fun pair(kind: AlertKind): ColorPair = when (kind) {
        AlertKind.Info -> ColorPair(tokens.info, tokens.infoContent)
        AlertKind.Success -> ColorPair(tokens.success, tokens.successContent)
        AlertKind.Warning -> ColorPair(tokens.warning, tokens.warningContent)
        AlertKind.Error -> ColorPair(tokens.error, tokens.errorContent)
    }

    /** The gated pair for a badge kind; the default is neutral. */
    public fun pair(kind: BadgeKind): ColorPair = when (kind) {
        BadgeKind.Default -> ColorPair(tokens.neutral, tokens.neutralContent)
        BadgeKind.Info -> pair(AlertKind.Info)
        BadgeKind.Success -> pair(AlertKind.Success)
        BadgeKind.Warning -> pair(AlertKind.Warning)
        BadgeKind.Error -> pair(AlertKind.Error)
    }

    private fun rail(color: Color) = Modifier.drawBehind {
        drawRect(color, topLeft = Offset.Zero, size = Size(4.dp.toPx(), size.height))
    }

    override fun alert(kind: AlertKind): Modifier {
        val shape = RoundedCornerShape(tokens.radiusBox)
        return Modifier
            .background(tokens.base100, shape)
            .border(tokens.borderBorder, pair(kind).fill, shape)
            .then(rail(pair(kind).fill))
            .padding(start = 16.dp, top = 12.dp, end = 12.dp, bottom = 12.dp)
    }

    override fun badge(kind: BadgeKind): Modifier =
        Modifier.background(pair(kind).fill, RoundedCornerShape(50)).padding(horizontal = 8.dp, vertical = 2.dp)

    override fun badgeText(kind: BadgeKind): Color = pair(kind).text

    override fun tag(): Modifier =
        Modifier.background(tokens.base200, RoundedCornerShape(tokens.radiusSelector)).padding(horizontal = 8.dp, vertical = 2.dp)

    override fun card(): Modifier {
        val shape = RoundedCornerShape(tokens.radiusBox)
        return Modifier.background(tokens.base100, shape).border(tokens.borderBorder, tokens.base300, shape).padding(16.dp)
    }

    override fun insetText(): Modifier = rail(tokens.neutral)
}
