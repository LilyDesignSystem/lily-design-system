// One test per contract clause of the first lily-compose slice (spec/android-kotlin, Testing), read from the semantics tree
// that TalkBack and the Accessibility Test Framework read. Robolectric runs them on the JVM, in bin/ci.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.assert
import androidx.compose.ui.test.assertCountEquals
import androidx.compose.ui.test.assertIsFocused
import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ComponentSemanticsTest {
    @get:Rule val rule = createComposeRule()

    private fun hasLiveRegion(mode: LiveRegionMode) = SemanticsMatcher.expectValue(SemanticsProperties.LiveRegion, mode)
    private val isHeading = SemanticsMatcher.keyIsDefined(SemanticsProperties.Heading)
    private val hasNoLiveRegion = SemanticsMatcher.keyNotDefined(SemanticsProperties.LiveRegion)
    private fun hasError(text: String) = SemanticsMatcher.expectValue(SemanticsProperties.Error, text)
    private fun hasRole(role: Role) = SemanticsMatcher.expectValue(SemanticsProperties.Role, role)

    @Test fun spokenJoinsConsumerTextWithALineBreakOnly() {
        assertEquals("Error\nEnter a date", LilySemantics.spoken("Error", "Enter a date"))
        assertEquals("Only", LilySemantics.spoken(null, "", "Only"))
        assertNull(LilySemantics.spoken(null, ""))
    }

    @Test fun warningTextIsOneStopWithThePrefixFirst() {
        rule.setContent { WarningText(prefix = "Warning", text = "You can be fined") { BasicText("!") } }
        rule.onNodeWithContentDescription("Warning\nYou can be fined").assertExists()
        rule.onAllNodesWithText("!").assertCountEquals(0) // the icon is hidden
    }

    @Test fun alertIsAssertiveByDefaultAndPoliteOrOffOnRequest() {
        rule.setContent {
            LilyAlert(message = "Saved", heading = "Done")
            LilyAlert(message = "Loading", politeness = Politeness.Polite)
            LilyAlert(message = "Quiet", politeness = Politeness.Off)
        }
        rule.onNodeWithContentDescription("Done\nSaved").assert(hasLiveRegion(LiveRegionMode.Assertive))
        rule.onNodeWithContentDescription("Loading").assert(hasLiveRegion(LiveRegionMode.Polite))
        rule.onNodeWithContentDescription("Quiet").assert(hasNoLiveRegion)
    }

    @Test fun errorSummaryTitleIsAFocusedHeadingAndProblemsAreButtons() {
        var chosen = ""
        rule.setContent {
            ErrorSummary(title = "There is a problem", problems = listOf(Problem("Enter your name") { chosen = "name" }))
        }
        rule.onNodeWithText("There is a problem").assert(isHeading).assertIsFocused()
        rule.onNodeWithText("Enter your name").assert(hasRole(Role.Button)).performClick()
        assertEquals("name", chosen)
    }

    @Test fun errorSummaryCanLeaveFocusAlone() {
        rule.setContent { ErrorSummary(title = "There is a problem", problems = emptyList(), focusOnAppear = false) }
        rule.onNodeWithText("There is a problem").assert(SemanticsMatcher.expectValue(SemanticsProperties.Focused, false))
    }

    @Test fun fieldNamesTheControlOnceAndCarriesItsError() {
        rule.setContent {
            Field(
                label = "Full name",
                description = "As on your passport",
                error = "Enter your full name",
                required = true,
                requiredLabel = "required",
            ) { BasicTextField(value = "", onValueChange = {}, modifier = it) }
        }
        rule.onNode(hasContentDescription("Full name\nAs on your passport\nrequired"))
            .assert(hasError("Enter your full name"))
        // The visible label, description, mark and error are hidden, so TalkBack stops once.
        rule.onAllNodesWithText("Full name").assertCountEquals(0)
        rule.onAllNodesWithText("Enter your full name").assertCountEquals(0)
        rule.onAllNodesWithText("*").assertCountEquals(0)
    }

    @Test fun fieldSaysRequiredOnlyWithTheAppsWord() {
        rule.setContent { Field(label = "Name", required = true) { BasicTextField("", {}, modifier = it) } }
        rule.onNode(hasContentDescription("Name")).assert(SemanticsMatcher.keyNotDefined(SemanticsProperties.Error))
    }

    @Test fun summaryListIsALabelledGroupOfMergedItems() {
        rule.setContent {
            SummaryList(label = "Personal details") {
                SummaryListItem(term = "Name") { BasicText("Sam Okoro") }
            }
        }
        rule.onNodeWithContentDescription("Personal details")
            .assert(SemanticsMatcher.expectValue(SemanticsProperties.IsTraversalGroup, true))
        rule.onNode(hasText("Name") and hasText("Sam Okoro"), useUnmergedTree = false).assertExists()
    }
}
