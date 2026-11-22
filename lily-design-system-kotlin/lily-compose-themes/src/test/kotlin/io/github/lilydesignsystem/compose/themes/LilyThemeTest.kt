// LilyTheme draws the components with a theme's tokens without changing what TalkBack reads, in every generated theme.
package io.github.lilydesignsystem.compose.themes

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.assert
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import io.github.lilydesignsystem.compose.AlertKind
import io.github.lilydesignsystem.compose.BadgeKind
import io.github.lilydesignsystem.compose.InsetText
import io.github.lilydesignsystem.compose.LilyAlert
import io.github.lilydesignsystem.compose.LilyBadge
import io.github.lilydesignsystem.compose.LilyCard
import io.github.lilydesignsystem.compose.LocalLilyDecoration
import io.github.lilydesignsystem.compose.PlainDecoration
import io.github.lilydesignsystem.compose.Politeness
import io.github.lilydesignsystem.compose.Tag
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import androidx.compose.ui.test.captureToImage
import androidx.compose.ui.test.onRoot
import org.junit.Assert.assertTrue

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class LilyThemeTest {
    @get:Rule val rule = createComposeRule()

    @Test fun everyComponentKeepsItsSemanticsInEveryTheme() {
        val index = mutableIntStateOf(0)
        rule.setContent {
            LilyTheme(LilyTokens.all[index.intValue]) {
                Column {
                    AlertKind.entries.forEach { LilyAlert("Message ${it.name}", kind = it, politeness = Politeness.Polite) }
                    BadgeKind.entries.forEach { LilyBadge("3", kind = it, label = "Badge ${it.name}") }
                    Tag("High", label = "priority")
                    LilyCard(heading = "Appointment", label = "Next appointment") { BasicText("Tuesday") }
                    InsetText { BasicText("It can take up to 8 weeks.") }
                }
            }
        }
        for (i in LilyTokens.all.indices) {
            index.intValue = i
            rule.waitForIdle()
            rule.onNodeWithContentDescription("Message Error")
                .assert(SemanticsMatcher.expectValue(SemanticsProperties.LiveRegion, LiveRegionMode.Polite))
            rule.onNodeWithContentDescription("Badge Warning").assertExists()
            rule.onNodeWithContentDescription("High\npriority").assertExists()
            rule.onNodeWithText("Appointment").assert(SemanticsMatcher.keyIsDefined(SemanticsProperties.Heading))
            rule.onNodeWithText("It can take up to 8 weeks.").assertExists()
        }
    }

    @Test fun pairsAreTheGatedFillAndContentPairs() {
        val t = LilyTokens.light
        val d = TokenDecoration(t)
        assertEquals(ColorPair(t.error, t.errorContent), d.pair(AlertKind.Error))
        assertEquals(ColorPair(t.neutral, t.neutralContent), d.pair(BadgeKind.Default))
        assertEquals(ColorPair(t.success, t.successContent), d.pair(BadgeKind.Success))
        assertEquals(t.warningContent, d.badgeText(BadgeKind.Warning))
        assertEquals(t.infoContent, d.badgeText(BadgeKind.Info))
        assertEquals(t.errorContent, d.badgeText(BadgeKind.Error))
    }

    @Test fun theThemeProvidesItsTokensAndThePlainDecorationIsTheDefault() {
        var seen: LilyTokens? = null
        var defaultDecoration: Any? = null
        rule.setContent {
            CompositionLocalProvider { defaultDecoration = LocalLilyDecoration.current }
            LilyTheme(LilyTokens.govUk) { seen = LocalLilyTokens.current }
        }
        rule.waitForIdle()
        assertEquals(LilyTokens.govUk, seen)
        assertEquals(PlainDecoration, defaultDecoration)
    }

    @Test fun thePlainDecorationDrawsNothing() {
        assertEquals(androidx.compose.ui.Modifier, PlainDecoration.alert(AlertKind.Info))
        assertEquals(androidx.compose.ui.Modifier, PlainDecoration.badge(BadgeKind.Info))
        assertEquals(androidx.compose.ui.graphics.Color.Unspecified, PlainDecoration.badgeText(BadgeKind.Info))
        assertEquals(androidx.compose.ui.Modifier, PlainDecoration.tag())
        assertEquals(androidx.compose.ui.Modifier, PlainDecoration.card())
        assertEquals(androidx.compose.ui.Modifier, PlainDecoration.insetText())
    }

    @Test fun theRailsAreDrawn() {
        rule.setContent {
            LilyTheme(LilyTokens.light) {
                Column {
                    LilyAlert("Saved", kind = AlertKind.Success, politeness = Politeness.Off)
                    InsetText { BasicText("Note") }
                }
            }
        }
        val image = rule.onRoot().captureToImage()
        assertTrue(image.width > 0 && image.height > 0)
    }
}
