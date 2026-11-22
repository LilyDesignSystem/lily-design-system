// The plain look: system text, no colour, spacing or shape of Lily's own. A theme (lily-compose-themes, P43-T5) or the app
// provides another through LocalLilyTextStyles.
package io.github.lilydesignsystem.compose

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

/** The text styles the components use. Every size is the platform default, so the user's font scale applies unchanged. */
@Immutable
public data class LilyTextStyles(
    val body: TextStyle = TextStyle.Default,
    val strong: TextStyle = TextStyle.Default.copy(fontWeight = FontWeight.Bold),
    val heading: TextStyle = TextStyle.Default.copy(fontWeight = FontWeight.Bold),
    val small: TextStyle = TextStyle.Default,
)

public val LocalLilyTextStyles: androidx.compose.runtime.ProvidableCompositionLocal<LilyTextStyles> =
    staticCompositionLocalOf { LilyTextStyles() }

/** Android's minimum touch target (48 by 48 dp). Foundation applies none, so the components apply it to what is tappable. */
public val LilyMinimumTouchTarget: androidx.compose.ui.unit.Dp = 48.dp
