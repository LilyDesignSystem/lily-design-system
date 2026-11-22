// The generated tokens hold the colour pairs the web themes gate: in light and dark every text colour is at least 4.5:1 on its
// fill (WCAG 1.4.3), as bin/check-theme --contrast --gate requires of the CSS.
package io.github.lilydesignsystem.compose.themes

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.unit.dp
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class TokensTest {
    private fun contrast(a: Color, b: Color): Double {
        val x = a.luminance().toDouble()
        val y = b.luminance().toDouble()
        return (maxOf(x, y) + 0.05) / (minOf(x, y) + 0.05)
    }

    private fun pairs(t: LilyTokens) = listOf(
        "base-content on base-100" to (t.baseContent to t.base100),
        "primary" to (t.primaryContent to t.primary),
        "secondary" to (t.secondaryContent to t.secondary),
        "accent" to (t.accentContent to t.accent),
        "neutral" to (t.neutralContent to t.neutral),
        "info" to (t.infoContent to t.info),
        "success" to (t.successContent to t.success),
        "warning" to (t.warningContent to t.warning),
        "error" to (t.errorContent to t.error),
    )

    @Test fun lightAndDarkPairsReachAA() {
        for (theme in listOf(LilyTokens.light, LilyTokens.dark)) {
            for ((name, pair) in pairs(theme)) {
                val ratio = contrast(pair.first, pair.second)
                assertTrue("${theme.slug} $name: $ratio", ratio >= 4.5)
            }
        }
    }

    @Test fun everyThemeIsGeneratedOnceWithItsSlug() {
        val slugs = LilyTokens.all.map { it.slug }
        assertEquals(slugs.toSet().size, slugs.size)
        assertTrue("united-kingdom-government-digital-service" in slugs)
        assertEquals(0.dp, LilyTokens.govUk.radiusBox)
        assertEquals(8.dp, LilyTokens.light.radiusBox)
        assertEquals(Color.White, LilyTokens.light.base100)
    }

    @Test fun everyNamedThemeIsInTheList() {
        val named = listOf(
            LilyTokens.light, LilyTokens.dark, LilyTokens.nhsEnglandPatients, LilyTokens.govUk, LilyTokens.uswds,
            LilyTokens.japanDigitalAgency,
        )
        assertEquals(named, LilyTokens.all)
    }
}
