// cspell:ignore RÉGION
// Every lily-compose component has a worked example, every example and the catalog compose, and the search uses Lily's folding.
package io.github.lilydesignsystem.compose.examples

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.assertCountEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExamplesTest {
    @get:Rule val rule = createComposeRule()

    @Test fun everyShippedComponentHasOneExample() {
        val slugs = Examples.all.map { it.slug }
        assertEquals(slugs.toSet().size, slugs.size)
        assertEquals(
            setOf("field", "error-summary", "summary-list", "warning-text", "alert", "badge", "tag", "card", "inset-text"),
            slugs.toSet(),
        )
        assertTrue(Examples.all.all { it.code.isNotEmpty() && it.summary.isNotEmpty() })
    }

    @Test fun searchIgnoresCaseAndAccents() {
        assertEquals(Examples.all.size, Examples.matching("").size)
        assertEquals(listOf("summary-list"), Examples.matching("SUMMARY LIST").map { it.slug })
        assertEquals(listOf("alert", "badge"), Examples.matching("LIVE RÉGION").map { it.slug })
    }

    @Test fun everyExampleComposesInItsDetailView() {
        val index = androidx.compose.runtime.mutableIntStateOf(0)
        rule.setContent { ExampleDetail(Examples.all[index.intValue]) }
        for (i in Examples.all.indices) {
            index.intValue = i
            rule.waitForIdle()
            rule.onNodeWithText(Examples.all[i].summary).assertIsDisplayed()
        }
    }

    @Test fun theContactFormShowsItsErrorAfterContinue() {
        rule.setContent { ExampleDetail(Examples.all.first { it.slug == "field" }) }
        rule.onAllNodesWithText("There is a problem").assertCountEquals(0)
        rule.onNodeWithText("Continue").performClick()
        rule.onNodeWithText("There is a problem").assertIsDisplayed()
    }

    @Test fun theCatalogFiltersAndSelects() {
        var chosen = ""
        rule.setContent { ExampleCatalog(title = "Components", searchLabel = "Search components", onSelect = { chosen = it }) }
        rule.onNode(hasContentDescription("Search components")).performTextInput("inset")
        rule.onAllNodesWithText("SummaryList").assertCountEquals(0)
        rule.onNodeWithText("InsetText").performClick()
        assertEquals("inset-text", chosen)
    }

    @Test fun theCatalogShowsTheSelectedExample() {
        rule.setContent { ExampleCatalog(title = "Components", searchLabel = "Search", selected = "tag") }
        rule.onNodeWithText("A label on an item, spoken with its context.").assertIsDisplayed()
    }
}
