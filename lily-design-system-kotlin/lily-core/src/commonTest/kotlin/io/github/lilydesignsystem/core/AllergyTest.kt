// One test per rule of allergy-record-list and its item, matching LilyCore's AllergyTests in Swift.
package io.github.lilydesignsystem.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class AllergyTest {
    @Test fun anyStatusButKnownShowsItsWordsAsTheOneItem() {
        AllergyListStatus.entries.forEach { assertEquals(it != AllergyListStatus.Known, AllergyRules.showsStatusItem(it)) }
    }

    @Test fun theListIsNamedByItsLabelElseItsStatusWords() {
        assertEquals("Allergies", AllergyRules.listName("Allergies", "No known allergies"))
        assertEquals("No known allergies", AllergyRules.listName(null, "No known allergies"))
        assertEquals("Not recorded", AllergyRules.listName("", "Not recorded"))
    }

    @Test fun aMissingStatusLabelWarns() {
        assertEquals(1, AllergyRules.listWarnings(null).size)
        assertEquals(1, AllergyRules.listWarnings("").size)
        assertTrue(AllergyRules.listWarnings("Known allergies").isEmpty())
    }

    @Test fun everyCodeWithoutWordsWarns() {
        val codes = AllergyCodes("severe", "high", "active", "refuted")
        assertEquals(4, AllergyRules.itemWarnings(codes, AllergyWords("Penicillin")).size)
        val words = AllergyWords("Penicillin", severity = "Severe", criticality = "High risk", clinicalStatus = "Active",
            verificationStatus = "Refuted")
        assertTrue(AllergyRules.itemWarnings(codes, words).isEmpty())
        assertTrue(AllergyRules.itemWarnings(AllergyCodes(), AllergyWords("Penicillin")).isEmpty())
    }

    @Test fun anItemSpeaksWhoseItIsFirstThenEveryPartInOrder() {
        val words = AllergyWords("Peanut", "Mother", "Anaphylaxis", "Severe", "High risk", "Active", "Confirmed", "Allergy",
            "Food", "3 Nov 2026")
        assertEquals("Mother\nPeanut\nAnaphylaxis\nSevere\nHigh risk\nActive\nConfirmed\nAllergy\nFood\n3 Nov 2026",
            AllergyRules.spoken(words))
        assertEquals("Latex", AllergyRules.spoken(AllergyWords("Latex", reaction = "")))
    }
}

class MedicationTest {
    @Test fun segmentsJoinIntoOneSpokenName() {
        val segments = listOf(MedicationNameSegment("hydr"), MedicationNameSegment("OXY", tallMan = true), MedicationNameSegment("zine"))
        assertEquals("hydrOXYzine", MedicationRules.name("ignored", segments))
        assertEquals("Paracetamol", MedicationRules.name("Paracetamol", emptyList()))
        assertEquals(null, MedicationRules.name(null, emptyList()))
        assertEquals(
            "Medication\nhydrOXYzine\n25 mg\ntablet\noral\ntwice a day",
            MedicationRules.spoken("Medication", null, segments, "25 mg", "tablet", "oral", "twice a day", ""),
        )
    }
}

class EarlyWarningScoreTest {
    @Test fun bandsNeedWordsAndSpeakInOrder() {
        assertEquals(1, EarlyWarningScoreRules.warnings("high", null).size)
        assertEquals(1, EarlyWarningScoreRules.warnings("high", "").size)
        assertTrue(EarlyWarningScoreRules.warnings("high", "High clinical risk").isEmpty())
        assertTrue(EarlyWarningScoreRules.warnings(null, null).isEmpty())
        assertEquals(
            "Early warning score\nNEWS2\n7\nHigh clinical risk\nCall the critical care outreach team",
            EarlyWarningScoreRules.spoken("Early warning score", "NEWS2", "7", "High clinical risk",
                "Call the critical care outreach team"),
        )
    }
}

class DecisionSupportTest {
    @Test fun namesItselfAndRefusesADismissalWithoutAReason() {
        assertEquals("S", DecisionSupportRules.name(null, "S"))
        assertEquals("S", DecisionSupportRules.name("", "S"))
        assertEquals("Alert", DecisionSupportRules.name("Alert", "S"))
        assertEquals(DismissOutcome.Dismissed(null), DecisionSupportRules.dismiss(false, null))
        assertEquals(DismissOutcome.Refused, DecisionSupportRules.dismiss(true, null))
        assertEquals(DismissOutcome.Refused, DecisionSupportRules.dismiss(true, ""))
        assertEquals(DismissOutcome.Dismissed("patient-declined"), DecisionSupportRules.dismiss(true, "patient-declined"))
        assertEquals(4, DecisionSupportRules.warnings("a".repeat(141), "", "", reasonsOffered = true).size)
        assertTrue(DecisionSupportRules.warnings("Short", "Warning", "Formulary", true, "Reason").isEmpty())
        assertTrue(DecisionSupportRules.warnings("Short", "Warning", "Formulary").isEmpty())
        assertEquals(listOf("info", "warning", "critical"), DecisionSupportIndicator.entries.map { it.key })
    }
}

class RecordListTest {
    @Test fun rulesNeverHideARecordSilently() {
        RecordListStatus.entries.forEach { assertEquals(it != RecordListStatus.Known, RecordRules.showsStatusItem(it)) }
        assertEquals("Immunisations", RecordRules.listName("Immunisations", "Known"))
        assertEquals("None recorded", RecordRules.listName(null, "None recorded"))
        assertTrue(RecordRules.showsContent(null) && RecordRules.showsContent(RecordEntryState.EnteredInError))
        assertTrue(!RecordRules.showsContent(RecordEntryState.Withheld))
        assertTrue(RecordRules.strikesContent(RecordEntryState.EnteredInError) && !RecordRules.strikesContent(null))
        assertEquals(1, RecordRules.listWarnings(null).size)
        assertTrue(RecordRules.listWarnings("Known").isEmpty())
        assertEquals(2, RecordRules.itemWarnings("active", null, RecordEntryState.Withheld, "").size)
        assertTrue(RecordRules.itemWarnings("", null, null, null).isEmpty())
        assertTrue(RecordRules.itemWarnings("active", "Active", RecordEntryState.Withheld, "Withheld").isEmpty())
        assertEquals(listOf("withheld", "entered-in-error"), RecordEntryState.entries.map { it.key })
    }
}
