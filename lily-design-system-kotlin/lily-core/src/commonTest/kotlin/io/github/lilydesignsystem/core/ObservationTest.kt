// One test per rule of observation-view, matching LilyCore's ObservationTests in Swift.
package io.github.lilydesignsystem.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue

class ObservationTest {
    // HC-C3
    @Test fun missingResultsShowTheirStatusWordsInsteadOfAValue() {
        val replacing = setOf(
            ObservationStatus.Cancelled, ObservationStatus.Masked, ObservationStatus.NotRecorded, ObservationStatus.Unavailable,
            ObservationStatus.Registered, ObservationStatus.NotApplicable,
        )
        ObservationStatus.entries.forEach { assertEquals(it in replacing, ObservationRules.statusReplacesValue(it), it.key) }
        assertNull(ObservationRules.shownValue("5.2", "mmol/L", ObservationStatus.Masked))
        assertEquals(
            "Potassium\nNot available yet",
            ObservationRules.spoken("Potassium", "5.2", "mmol/L", null, null, null, status = ObservationStatus.Unavailable,
                statusLabel = "Not available yet", previousLabel = null),
        )
    }

    @Test fun everyStatusButFinalIsShown() {
        ObservationStatus.entries.forEach { assertEquals(it != ObservationStatus.Final, ObservationRules.showsStatus(it)) }
    }

    // HC-C2
    @Test fun onlyANonNormalCodeIsAFlagAndNothingIsInferred() {
        assertFalse(ObservationRules.isFlagged(null))
        assertFalse(ObservationRules.isFlagged(""))
        assertFalse(ObservationRules.isFlagged("N"))
        assertTrue(ObservationRules.isFlagged("H"))
        assertEquals(
            "9\n3.5 to 5.5",
            ObservationRules.spoken(null, "9", null, "High", null, "3.5 to 5.5", status = ObservationStatus.Final,
                statusLabel = null, previousLabel = null),
        )
    }

    // HC-F4
    @Test fun valueAndUnitAreJoinedByANoBreakSpace() {
        assertEquals("5 mg", ObservationRules.shownValue("5", "mg", ObservationStatus.Final))
        assertEquals("5", ObservationRules.shownValue("5", "", ObservationStatus.Final))
        assertEquals("5", ObservationRules.shownValue("5", null, ObservationStatus.Final))
        assertNull(ObservationRules.shownValue("", "mg", ObservationStatus.Final))
    }

    @Test fun spokenOrderIsLabelValueFlagRangesStatusPrevious() {
        assertEquals(
            "Potassium\n6.1 mmol/L\nHigh\n3.5 to 5.5 mmol/L\nCritical above 6.5\nAmended\nwas 5.1 until 3 Nov",
            ObservationRules.spoken("Potassium", "6.1", "mmol/L", "High", "H", "3.5 to 5.5 mmol/L",
                listOf(NamedRange("Critical", "above 6.5")), ObservationStatus.Amended, "Amended", "was 5.1 until 3 Nov"),
        )
    }

    @Test fun warningsNameEveryMissingWord() {
        assertEquals(3, ObservationRules.warnings("H", null, ObservationStatus.Preliminary, "", "5.1", null).size)
        assertTrue(ObservationRules.warnings("N", null, ObservationStatus.Final, null, null, null).isEmpty())
        assertTrue(ObservationRules.warnings("H", "High", ObservationStatus.Amended, "Amended", "5.1", "was 5.1").isEmpty())
        assertEquals(
            listOf("ObservationView: status amended needs a statusLabel"),
            ObservationRules.warnings(null, null, ObservationStatus.Amended, null, null, null),
        )
    }

    // HC-C12, HC-C13, HC-C14 (spec/healthcare-ui/requirements.md): docs/audits/gpt-6-2-astra-high finding 2.
    @Test
    fun withheldAndWithdrawnResultsSpeakOnlyTheirWords() {
        fun spoken(status: ObservationStatus, words: String?, show: Boolean = false) = ObservationRules.spoken(
            "Potassium", "5.9", "mmol/L", "Critically high", "HH", "3.5-5.3", listOf(NamedRange("Critical", "above 6.5")),
            status, words, "was 5.1", show,
        )
        for (status in listOf(ObservationStatus.Masked, ObservationStatus.Registered, ObservationStatus.NotApplicable, ObservationStatus.EnteredInError)) {
            assertEquals("Potassium\nWords", spoken(status, "Words"))
        }
        assertEquals("Potassium\nEntered in error\n5.9\u00a0mmol/L", spoken(ObservationStatus.EnteredInError, "Entered in error", true))
        for (status in ObservationStatus.entries.filter { it != ObservationStatus.Final }) {
            assertEquals("Potassium", spoken(status, null, true))
        }
    }
}
