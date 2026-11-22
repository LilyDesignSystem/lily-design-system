// Cases the shared JSON vectors cannot express (JSON has no NaN or infinity), the default arguments, and the Kotlin-only API.
package io.github.lilydesignsystem.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull

class EdgeTest {
    @Test fun meterScaleRefusesNonFiniteNumbers() {
        assertNull(meterScale(Double.NaN, 3.0, 5.0))
        assertNull(meterScale(Double.POSITIVE_INFINITY, 3.0, 5.0))
        assertNull(meterScale(4.0, Double.NaN, 5.0))
        assertNull(meterScale(4.0, 3.0, Double.NEGATIVE_INFINITY))
        assertNull(meterScale(null))
    }

    @Test fun meterScaleDefaultsToNoRangeAndIgnoresAnEmptyUnit() {
        assertNull(meterScale(4.0))
        assertEquals(MeterScale(0.0, 7.5, high = 5.0), meterScale(4.0, high = 5.0))
        assertEquals(MeterScale(2.0, 6.0, 3.0, 5.0), meterScale(4.0, 3.0, 5.0, valueUnit = "", rangeUnit = "mg"))
    }

    @Test fun truncateMiddleDefaultsToAnEvenSplit() {
        assertEquals("ab…ij", truncateMiddle("abcdefghij", ellipsis = "…", maxWidth = 5.0) { it.length.toDouble() })
        assertEquals("short", truncateMiddle("short", "…", 10.0) { it.length.toDouble() })
    }

    @Test fun keysMatchTheTypeScript() {
        assertEquals(listOf("even", "fixed-end", "min-end"), TruncationStrategy.entries.map { it.key })
        assertNull(TruncationStrategy.fromKey("middle"))
        assertEquals(TruncationStrategy.MinEnd, TruncationStrategy.fromKey("min-end"))
        assertNull(AgeUnit.fromKey("fortnights"))
        assertEquals(listOf("year", "month", "day"), DatePrecision.entries.map { it.key })
    }

    @Test fun ageBeforeBirthThrows() {
        assertFailsWith<IllegalArgumentException> { ageParts(100, 0) }
    }

    @Test fun durationPartsDefaultsToZero() {
        assertEquals(DurationParts(), DurationParts(0, 0, 0, 0, 0, 0, 0.0, false))
    }

    @Test fun typeaheadDefaults() {
        assertEquals(true, isTypeaheadKey("a"))
        assertEquals(TypeaheadState("ab", 700), nextTypeaheadState(TypeaheadState("a", 0), "b", 700))
        assertEquals(TypeaheadState("b", 701), nextTypeaheadState(TypeaheadState("a", 0), "b", 701))
        assertEquals(TypeaheadState(), TypeaheadState("", 0))
    }
}
