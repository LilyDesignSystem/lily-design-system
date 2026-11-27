// The Compose form parts (tasks.md P62-T3), read from the semantics tree TalkBack reads. Robolectric runs them on the JVM.
package io.github.lilydesignsystem.compose

import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.assert
import androidx.compose.ui.test.assertCountEquals
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import io.github.lilydesignsystem.core.DateFieldOrder
import io.github.lilydesignsystem.core.DateFieldPart
import io.github.lilydesignsystem.core.DateFieldPrecision
import io.github.lilydesignsystem.core.QuantityProblem
import io.github.lilydesignsystem.core.StepStatus
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class FormPartsComposeTest {
    @get:Rule val rule = createComposeRule()

    private val parts = mapOf(DateFieldPart.Day to "Day", DateFieldPart.Month to "Month", DateFieldPart.Year to "Year")

    @Test fun dateFieldPartsAreSpokenWithTheDateAndJoinToIso() {
        var value by mutableStateOf("")
        rule.setContent { DateField("Date of birth", parts, DateFieldOrder.Dmy, value, { value = it }, error = "Enter a date") }
        rule.onNodeWithContentDescription("Date of birth\nDay").assert(SemanticsMatcher.expectValue(SemanticsProperties.Error, "Enter a date"))
        rule.onNodeWithContentDescription("Date of birth\nDay").performTextInput("3")
        rule.onNodeWithContentDescription("Date of birth\nMonth").performTextInput("2")
        rule.onNodeWithContentDescription("Date of birth\nYear").performTextInput("1949")
        rule.waitForIdle()
        assertEquals("1949-02-03", value)
    }

    @Test fun aDateFieldWarnsForAMissingPartLabel() {
        assertEquals(2, dateFieldWarnings(DateFieldPrecision.Day, mapOf(DateFieldPart.Year to "Year")).size)
        assertEquals(0, dateFieldWarnings(DateFieldPrecision.Year, mapOf(DateFieldPart.Year to "Year")).size)
    }

    @Test fun aQuantityKeepsToItsUnitsLimitsAndTheUnitsAreRadios() {
        val units = listOf(QuantityUnit("kg", "kilograms", 1.0, 400.0), QuantityUnit("lb", "pounds", 2.0, 880.0))
        assertEquals(QuantityProblem.AboveMaximum, quantityInputProblem("500", "kg", units))
        assertEquals(null, quantityInputProblem("500", "lb", units))
        var unit by mutableStateOf("kg")
        rule.setContent { QuantityInput("Your weight", "Weight", units, "70", {}, unit, { unit = it }, unitLabel = "Weight unit") }
        rule.onNodeWithText("pounds").assert(SemanticsMatcher.expectValue(SemanticsProperties.Selected, false)).performClick()
        rule.waitForIdle()
        assertEquals("lb", unit)
    }

    @Test fun aRepeatableFieldsetAddsAndRemovesWithinItsLimits() {
        var items by mutableStateOf(listOf("Ramipril"))
        rule.setContent {
            RepeatableFieldset(
                "Medicines", items, { items = it }, { "" }, { "Medicine $it" }, "Add a medicine", { "Remove medicine $it" },
                min = 1, max = 2, addedLabel = { "Medicine $it added" },
            ) { name, _ -> BasicText(name) }
        }
        rule.onAllNodesWithText("Remove medicine 1").assertCountEquals(0)
        rule.onNodeWithText("Add a medicine").performClick()
        rule.waitForIdle()
        assertEquals(2, items.size)
        rule.onNodeWithText("Medicine 2 added").assertExists()
        rule.onNodeWithText("Add a medicine").assert(SemanticsMatcher.keyIsDefined(SemanticsProperties.Disabled))
        rule.onNodeWithText("Remove medicine 2").performClick()
        rule.waitForIdle()
        assertEquals(listOf("Ramipril"), items)
    }

    @Test fun eachStepSaysItsStatusInWords() {
        rule.setContent { StepList("Questions", listOf("About you", "Medicines"), 1, { it.key }) }
        rule.onNodeWithContentDescription("About you\nfinished").assertExists()
        rule.onNodeWithContentDescription("Medicines\nin-progress").assert(SemanticsMatcher.expectValue(SemanticsProperties.Selected, true))
        assertEquals(listOf(StepStatus.Waiting, StepStatus.Waiting), stepListStatuses(2, -1))
    }
}
