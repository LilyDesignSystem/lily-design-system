// Cases the shared JSON vectors cannot express (JSON has no NaN or infinity), the default arguments, and the Kotlin-only API.
package io.github.lilydesignsystem.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull

class EdgeTest {
    @Test fun meterScaleThrowsForNonFiniteNumbers() {
        assertEquals("value", assertFailsWith<MeterScaleException> { meterScale(Double.NaN, 3.0, 5.0) }.reason)
        assertEquals("value", assertFailsWith<MeterScaleException> { meterScale(Double.POSITIVE_INFINITY, 3.0, 5.0) }.reason)
        assertEquals("range", assertFailsWith<MeterScaleException> { meterScale(4.0, Double.NaN, 5.0) }.reason)
        assertEquals("range", assertFailsWith<MeterScaleException> { meterScale(4.0, 3.0, Double.NEGATIVE_INFINITY) }.reason)
        assertNull(meterScale(null, 3.0, 5.0)) // no result yet: nothing to draw, not an error
        assertNull(meterScale(4.0)) // no reference range: nothing to draw
    }

    @Test fun theCoreFunctionsThrowForInputTheVectorsCannotWrite() {
        val one = listOf(WheelOption("a", "A"))
        assertEquals("maxWidth", assertFailsWith<TruncateMiddleException> {
            truncateMiddle("abc", "…", Double.POSITIVE_INFINITY) { it.length.toDouble() }
        }.reason)
        assertEquals("end", assertFailsWith<TruncateMiddleException> {
            truncateMiddle("abc", "…", 1.0, TruncationStrategy.FixedEnd, end = -1) { it.length.toDouble() }
        }.reason)
        assertEquals("pageSize", assertFailsWith<WheelPickerException> {
            nextWheelIndex(one, 0, WheelMoveKey.PageDown, pageSize = Double.NaN)
        }.reason)
        assertEquals("centre", assertFailsWith<WheelPickerException> { wheelIndexNearest(one, listOf(0.0), Double.NaN) }.reason)
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

    @Test fun aMeterReadingRefusesAValueOffItsScale() {
        val scale = MeterScale(2.5, 6.5, 3.5, 5.5)
        assertEquals(6.1, MeterReading(6.1, scale).value)
        assertEquals(scale, MeterReading(2.5, scale).scale)
        assertFailsWith<IllegalArgumentException> { MeterReading(9.0, scale) }
        assertFailsWith<IllegalArgumentException> { MeterReading(2.0, scale) }
        assertFailsWith<IllegalArgumentException> { MeterReading(Double.NaN, scale) }
    }
}
