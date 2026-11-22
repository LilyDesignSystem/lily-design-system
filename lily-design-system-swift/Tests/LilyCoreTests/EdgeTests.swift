// Cases the shared JSON vectors cannot express (JSON has no NaN or infinity), and the Swift-only API surface.

import Foundation
import Testing

@testable import LilyCore

@Test func meterScaleThrowsForNonFiniteNumbers() throws {
    #expect(throws: MeterScaleError.value) { try meterScale(.nan, low: 3, high: 5) }
    #expect(throws: MeterScaleError.value) { try meterScale(.infinity, low: 3, high: 5) }
    #expect(throws: MeterScaleError.range) { try meterScale(4, low: .nan, high: 5) }
    #expect(throws: MeterScaleError.range) { try meterScale(4, low: 3, high: .infinity) }
    #expect(try meterScale(nil, low: 3, high: 5) == nil)  // no result yet: nothing to draw, not an error
    #expect(try meterScale(4) == nil)  // no reference range: nothing to draw
    #expect(MeterScaleError.units.reason == "units")
}

@Test func meterScaleIgnoresAnEmptyUnit() throws {
    #expect(try meterScale(4, low: 3, high: 5, valueUnit: "", rangeUnit: "mg") == MeterScale(min: 2, max: 6, low: 3, high: 5))
}

@Test func theCoreFunctionsThrowForInputTheVectorsCannotWrite() {
    #expect(throws: TruncateMiddleError.maxWidth) {
        try truncateMiddle("abc", ellipsis: "…", maxWidth: .infinity, measure: { Double($0.count) })
    }
    #expect(throws: TruncateMiddleError.end) {
        try truncateMiddle("abc", ellipsis: "…", maxWidth: 1, strategy: .fixedEnd, end: -1, measure: { Double($0.count) })
    }
    #expect(throws: WheelPickerError.pageSize) {
        try nextWheelIndex([WheelOption(value: "a", label: "A")], current: 0, key: .pageDown, pageSize: .nan)
    }
    #expect(throws: WheelPickerError.centre) {
        try wheelIndexNearest([WheelOption(value: "a", label: "A")], middles: [0], centre: .infinity)
    }
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
