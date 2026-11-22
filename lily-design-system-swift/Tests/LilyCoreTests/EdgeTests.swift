// Cases the shared JSON vectors cannot express (JSON has no NaN or infinity), and the Swift-only API surface.

import Foundation
import Testing

@testable import LilyCore

@Test func meterScaleRefusesNonFiniteNumbers() {
    #expect(meterScale(.nan, low: 3, high: 5) == nil)
    #expect(meterScale(.infinity, low: 3, high: 5) == nil)
    #expect(meterScale(4, low: .nan, high: 5) == nil)
    #expect(meterScale(4, low: 3, high: .infinity) == nil)
    #expect(meterScale(nil, low: 3, high: 5) == nil)
}

@Test func meterScaleIgnoresAnEmptyUnit() {
    #expect(meterScale(4, low: 3, high: 5, valueUnit: "", rangeUnit: "mg") == MeterScale(min: 2, max: 6, low: 3, high: 5))
}

@Test func truncationStrategiesHaveTheTypeScriptKeys() {
    #expect(TruncationStrategy.allKeys == ["even", "fixed-end", "min-end"])
}

@Test func searchSegmentStoresItsText() {
    let segment = SearchSegment(text: "café", match: true)
    #expect(segment.text == "café" && segment.match)
}

@Test func ageUnitsHaveTheTypeScriptKeys() {
    #expect(
        [AgeUnit.minutes, .hours, .days, .weeks, .months, .years].map(\.rawValue)
            == ["minutes", "hours", "days", "weeks", "months", "years"])
}

@Test func ageBeforeBirthThrowsItsOwnError() {
    #expect(throws: ClinicalFormatError.atBeforeBirth) {
        try ageParts(birth: Date(timeIntervalSince1970: 100), at: Date(timeIntervalSince1970: 0))
    }
}

@Test func htmlDurationKeepsAnUnsignedValue() throws {
    let d = try #require(htmlDuration("PT90M"))
    #expect(d.datetime == "PT90M" && !d.negative)
}

@Test func typeaheadDefaults() {
    #expect(isTypeaheadKey("a"))
    #expect(nextTypeaheadState(TypeaheadState(prefix: "a"), key: "b", now: 700) == TypeaheadState(prefix: "ab", at: 700))
    #expect(nextTypeaheadState(TypeaheadState(prefix: "a"), key: "b", now: 701) == TypeaheadState(prefix: "b", at: 701))
    #expect(typeaheadResetMilliseconds == 700)
}

@Test func aMeterReadingRefusesAValueOffItsScale() throws {
    let scale = MeterScale(min: 2.5, max: 6.5, low: 3.5, high: 5.5)
    #expect(try MeterReading(value: 6.1, scale: scale).value == 6.1)
    #expect(try MeterReading(value: 2.5, scale: scale).value == 2.5)
    #expect(throws: ClinicalFormatError.meterValueOffScale(9)) { try MeterReading(value: 9, scale: scale) }
    #expect(throws: ClinicalFormatError.meterValueOffScale(2)) { try MeterReading(value: 2, scale: scale) }
    #expect(throws: (any Error).self) { try MeterReading(value: .nan, scale: scale) }
}
