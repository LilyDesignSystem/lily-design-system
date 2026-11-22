// The Accessibility Test Framework (ATF) on the example app (tasks.md P45-T4, P45-T5): the catalog, then every component's
// detail view. Run it at font scale 1.0 and 2.0 (adb shell settings put system font_scale 2.0). enableAccessibilityChecks() runs ATF before each action, and the
// explicit tryPerformAccessibilityChecks() checks each screen as shown. Needs API 34 or later (a device or emulator).
package io.github.lilydesignsystem.examples

import androidx.compose.ui.semantics.SemanticsActions
import androidx.compose.ui.test.hasClickAction
import androidx.compose.ui.test.hasScrollAction
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.performScrollToNode
import androidx.compose.ui.test.junit4.accessibility.enableAccessibilityChecks
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.performSemanticsAction
import androidx.compose.ui.test.tryPerformAccessibilityChecks
import androidx.test.ext.junit.runners.AndroidJUnit4
import io.github.lilydesignsystem.compose.examples.Examples
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class AccessibilityChecksTest {
    @get:Rule val rule = createAndroidComposeRule<CatalogActivity>()

    @Before fun enable() {
        rule.enableAccessibilityChecks()
    }

    @Test fun theCatalogPassesTheChecks() {
        rule.onRoot().tryPerformAccessibilityChecks()
    }

    @Test fun everyDetailViewPassesTheChecks() {
        for (example in Examples.all) {
            // Scroll the catalog to the example's row (a lazy list composes only what is near the screen), open it, check it,
            // then go back.
            rule.onNode(hasScrollAction()).performScrollToNode(hasText(example.name) and hasClickAction())
            rule.onNode(hasText(example.name) and hasClickAction())
                .performSemanticsAction(SemanticsActions.OnClick)
            rule.waitForIdle()
            rule.onRoot().tryPerformAccessibilityChecks()
            rule.runOnUiThread { rule.activity.onBackPressedDispatcher.onBackPressed() }
            rule.waitForIdle()
        }
    }
}
