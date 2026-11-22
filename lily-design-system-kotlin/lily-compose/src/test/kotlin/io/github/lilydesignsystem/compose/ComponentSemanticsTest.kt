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
import org.robolectric.annotation.GraphicsMode
import androidx.compose.ui.test.captureToImage
import androidx.compose.ui.test.onRoot

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
@GraphicsMode(GraphicsMode.Mode.NATIVE)
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

    @Test fun badgeIsPoliteAndSpeaksItsLabelOrText() {
        rule.setContent {
            LilyBadge("3", label = "3 unread messages", kind = BadgeKind.Info)
            LilyBadge("New")
        }
        rule.onNodeWithContentDescription("3 unread messages").assert(hasLiveRegion(LiveRegionMode.Polite))
        rule.onNodeWithContentDescription("New").assert(hasLiveRegion(LiveRegionMode.Polite))
        assertEquals("New", LilySemantics.badgeLabel("New", ""))
    }

    @Test fun tagSpeaksTextThenLabelAndIsLiveOnlyWhenAsked() {
        rule.setContent {
            Tag("High", label = "priority")
            Tag("Running", label = "Job status", live = true)
        }
        rule.onNodeWithContentDescription("High\npriority").assert(hasNoLiveRegion)
        rule.onNodeWithContentDescription("Job status")
            .assert(hasLiveRegion(LiveRegionMode.Polite))
            .assert(SemanticsMatcher.expectValue(SemanticsProperties.StateDescription, "Running"))
    }

    @Test fun cardHeadingIsAHeadingAndALabelNamesTheGroup() {
        rule.setContent {
            LilyCard(heading = "Appointment", label = "Next appointment") { BasicText("Tuesday") }
            LilyCard { BasicText("No heading") }
        }
        rule.onNodeWithText("Appointment").assert(isHeading)
        rule.onNodeWithContentDescription("Next appointment")
            .assert(SemanticsMatcher.expectValue(SemanticsProperties.IsTraversalGroup, true))
        rule.onNodeWithText("No heading").assertExists()
    }

    @Test fun insetTextIsOneStop() {
        rule.setContent { InsetText { BasicText("It can take up to 8 weeks.") } }
        val merges = SemanticsMatcher("merges its descendants") { it.config.isMergingSemanticsOfDescendants }
        rule.onNode(hasText("It can take up to 8 weeks.") and merges).assertExists()
    }

    @Test fun observationViewIsOneStopSpeakingTheRulesInOrder() {
        rule.setContent {
            androidx.compose.foundation.layout.Column {
                ObservationView(
                    value = "6.1", unit = "mmol/L", interpretation = "H", flagLabel = "High", range = "3.5 to 5.5 mmol/L",
                    ranges = listOf(io.github.lilydesignsystem.core.NamedRange("Critical", "above 6.5")),
                    status = io.github.lilydesignsystem.core.ObservationStatus.Amended, statusLabel = "Amended",
                    previousValue = "5.1", previousLabel = "was 5.1 until 3 Nov", label = "Potassium",
                    meterValue = 6.1, meter = io.github.lilydesignsystem.core.MeterScale(2.5, 6.5, 3.5, 5.5),
                )
                ObservationView(
                    value = "5.2", status = io.github.lilydesignsystem.core.ObservationStatus.Masked,
                    statusLabel = "Hidden at the patient's request", label = "Sodium",
                    meterValue = 5.2, meter = io.github.lilydesignsystem.core.MeterScale(0.0, 10.0),
                )
                ObservationView(value = "4.2", interpretation = "N", flagLabel = "Normal")
            }
        }
        rule.onNodeWithContentDescription(
            "Potassium\n6.1\u00A0mmol/L\nHigh\n3.5 to 5.5 mmol/L\nCritical\u00A0above 6.5\nAmended\nwas 5.1 until 3 Nov",
        ).assertExists()
        rule.onNodeWithContentDescription("Sodium\nHidden at the patient's request").assertExists()
        rule.onNodeWithContentDescription("4.2").assertExists()
        rule.onAllNodesWithText("Normal").assertCountEquals(0)
        rule.onRoot().captureToImage() // draws the meter
    }

    @Test fun observationWarningsCanBeSilenced() {
        LilyWarnings.enabled = false
        rule.setContent { ObservationView(value = "9", interpretation = "H") }
        rule.onNodeWithContentDescription("9").assertExists()
        LilyWarnings.enabled = true
    }

    @Test fun ageAndDurationViewsSpeakLabelThenValue() {
        rule.setContent {
            androidx.compose.foundation.layout.Column {
                AgeView("5 years 2 months", duration = "P5Y2M", label = "Age")
                AgeView("")
                DurationView("3 days early", duration = "-P3D", label = "Delivery")
                DurationView("1 year", duration = "P1Y")
            }
        }
        rule.onNodeWithContentDescription("Age\n5 years 2 months").assertExists()
        rule.onNodeWithContentDescription("Delivery\n3 days early").assertExists()
        rule.onNodeWithContentDescription("1 year").assertExists()
        assertEquals(io.github.lilydesignsystem.core.HtmlDuration("P3D", true), parsedDuration("-P3D"))
        assertNull(parsedDuration("P1Y"))
        assertEquals(1, durationWarnings("P1Y").size)
        assertEquals(0, durationWarnings("PT90M").size)
    }
}
