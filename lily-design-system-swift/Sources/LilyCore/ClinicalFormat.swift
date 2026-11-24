// The Swift port of the locale-independent half of shared/clinical-format.ts, proved equal by
// shared/vectors/clinical-format.json (tasks.md P43-T3). These functions decide how a value is written or drawn, never what the
// value is: no unit conversion, no rounding of a dose, no reference range, no locale default.

import Foundation

public enum ClinicalFormatError: Error, Equatable, Sendable {
    // No case carries the value it refused: an error reaches logs and crash reports, and a clinical value is patient data
    // (spec/lessons/openehr-rust item 1).
    /// A meter value that is not a finite number, or that lies outside its scale.
    case meterValueOffScale
    case atBeforeBirth
    case notAPartialDate
    case notADuration
}

/// A meter's scale for a value and its reference range (observation-view). A drawing decision, never a clinical one.
public struct MeterScale: Equatable, Sendable {
    public var min: Double
    public var max: Double
    public var low: Double?
    public var high: Double?

    public init(min: Double, max: Double, low: Double? = nil, high: Double? = nil) {
        self.min = min
        self.max = max
        self.low = low
        self.high = high
    }
}

/// A value on its meter scale, checked: a value that is not finite or lies outside the scale is an error, never clamped.
public struct MeterReading: Sendable, Equatable {
    public let value: Double
    public let scale: MeterScale

    public init(value: Double, scale: MeterScale) throws {
        guard value.isFinite, value >= scale.min, value <= scale.max else {
            throw ClinicalFormatError.meterValueOffScale
        }
        self.value = value
        self.scale = scale
    }
}

/// Why `meterScale` refused its input; the raw value is the TypeScript `MeterScaleError.reason`.
public enum MeterScaleError: String, LilyRangeError, Equatable {
    case value, range, reversed, bound, units
}

/// Two-sided range: half a range beyond each end. One-sided: from zero to half as far again as the bound. Always wide enough to
/// hold the value. `nil` (draw no meter) only when there is nothing to draw: no value, or neither end given. Malformed input
/// throws a `MeterScaleError`, never a fallback: a value or a given end that is not finite, units that differ, a two-sided range
/// that is reversed or has no width, or a one-sided bound that is not above zero.
public func meterScale(
    _ value: Double?, low: Double? = nil, high: Double? = nil, valueUnit: String? = nil, rangeUnit: String? = nil
) throws(MeterScaleError) -> MeterScale? {
    // No value, or no range: nothing to draw. `bound` is the one end of a one-sided range (high first, as in TypeScript).
    guard let value, let bound = high ?? low else { return nil }
    guard value.isFinite else { throw .value }
    if let low, !low.isFinite { throw .range }
    if let high, !high.isFinite { throw .range }
    if let valueUnit, let rangeUnit, !valueUnit.isEmpty, !rangeUnit.isEmpty, valueUnit != rangeUnit { throw .units }
    let lower: Double
    let upper: Double
    if let low, let high {
        if low >= high { throw .reversed }
        let half = (high - low) / 2
        lower = low - half
        upper = high + half
    } else {
        if bound <= 0 { throw .bound }
        lower = 0
        upper = bound * 1.5
    }
    return MeterScale(min: Swift.min(lower, value), max: Swift.max(upper, value), low: low, high: high)
}

public enum AgeUnit: String, Sendable {
    case minutes, hours, days, weeks, months, years
}

public struct AgePart: Equatable, Sendable {
    public var value: Int
    public var unit: AgeUnit
    public init(value: Int, unit: AgeUnit) {
        self.value = value
        self.unit = unit
    }
}

private let minute: Int64 = 60_000
private let hour: Int64 = 60 * minute
private let day: Int64 = 24 * hour

private var utc: Calendar {
    var calendar = Calendar(identifier: .gregorian)
    calendar.timeZone = TimeZone(identifier: "UTC")!
    return calendar
}

private func milliseconds(_ date: Date) -> Int64 { Int64((date.timeIntervalSince1970 * 1000).rounded(.down)) }

private func daysInMonth(year: Int, month: Int) -> Int {
    let date = utc.date(from: DateComponents(year: year, month: month, day: 1))!
    return utc.range(of: .day, in: .month, for: date)!.count
}

/// Whole months counted from birth (a day past the end of a shorter month lands on its last day), then the days after them.
private func calendarDifference(_ birth: Date, _ at: Date) -> (years: Int, months: Int, days: Int) {
    let b = utc.dateComponents([.year, .month, .day, .hour, .minute, .second, .nanosecond], from: birth)
    let a = utc.dateComponents([.year, .month, .day, .hour, .minute, .second, .nanosecond], from: at)
    func timeOfDay(_ c: DateComponents) -> Int64 {
        Int64(c.hour!) * hour + Int64(c.minute!) * minute + Int64(c.second!) * 1000 + Int64(c.nanosecond! / 1_000_000)
    }
    let earlier = timeOfDay(a) < timeOfDay(b) ? 1 : 0
    var totalMonths = (a.year! - b.year!) * 12 + a.month! - b.month!
    var days = a.day! - b.day! - earlier
    if totalMonths > 0 && days < 0 {
        totalMonths -= 1
        let monthIndex = b.month! - 1 + totalMonths
        let year = b.year! + monthIndex / 12
        let month = monthIndex % 12 + 1
        let anchor = utc.date(
            from: DateComponents(year: year, month: month, day: Swift.min(b.day!, daysInMonth(year: year, month: month))))!
        let atDay = utc.date(from: DateComponents(year: a.year!, month: a.month!, day: a.day!))!
        days = Int(((milliseconds(atDay) - milliseconds(anchor)) / day)) - earlier
    }
    return (totalMonths / 12, totalMonths % 12, days)
}

/// The age at `at` of someone born at `birth`, in the NHS Common User Interface's unit bands. Returns numbers and unit keys,
/// never words: format them with `Duration.UnitsFormatStyle`, `DateComponentsFormatter` or the consumer's own labels.
public func ageParts(birth: Date, at: Date) throws -> [AgePart] {
    let elapsed = milliseconds(at) - milliseconds(birth)
    if elapsed < 0 { throw ClinicalFormatError.atBeforeBirth }
    if elapsed < 2 * hour { return [AgePart(value: Int(elapsed / minute), unit: .minutes)] }
    if elapsed < 2 * day { return [AgePart(value: Int(elapsed / hour), unit: .hours)] }
    let totalDays = Int(elapsed / day)
    if totalDays < 28 { return [AgePart(value: totalDays, unit: .days)] }
    let (years, months, days) = calendarDifference(birth, at)
    if years < 1 { return [AgePart(value: totalDays / 7, unit: .weeks), AgePart(value: totalDays % 7, unit: .days)] }
    if years < 2 { return [AgePart(value: years * 12 + months, unit: .months), AgePart(value: days, unit: .days)] }
    if years < 18 { return [AgePart(value: years, unit: .years), AgePart(value: months, unit: .months)] }
    return [AgePart(value: years, unit: .years)]
}

/// Age parts as an ISO 8601 duration; weeks are written as days.
public func toIsoDuration(_ parts: [AgePart]) -> String {
    var years = 0, months = 0, days = 0, hours = 0, minutes = 0
    for part in parts {
        switch part.unit {
        case .years: years += part.value
        case .months: months += part.value
        case .weeks: days += part.value * 7
        case .days: days += part.value
        case .hours: hours += part.value
        case .minutes: minutes += part.value
        }
    }
    let date = (years != 0 ? "\(years)Y" : "") + (months != 0 ? "\(months)M" : "") + (days != 0 ? "\(days)D" : "")
    let time = (hours != 0 ? "\(hours)H" : "") + (minutes != 0 ? "\(minutes)M" : "")
    if date.isEmpty && time.isEmpty { return "PT0M" }
    return "P\(date)" + (time.isEmpty ? "" : "T\(time)")
}

public enum DatePrecision: String, Sendable {
    case year, month, day
}

/// "year", "month" or "day": how precise a partial ISO 8601 date (YYYY, YYYY-MM or YYYY-MM-DD) is.
public func partialDatePrecision(_ iso: String) throws -> DatePrecision {
    guard let match = iso.wholeMatch(of: /(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?/) else {
        throw ClinicalFormatError.notAPartialDate
    }
    let year = Int(match.1)!
    let month = match.2.map { Int($0)! }
    let dayOfMonth = match.3.map { Int($0)! }
    if let month, !(1...12).contains(month) { throw ClinicalFormatError.notAPartialDate }
    if let dayOfMonth, let month, !(1...daysInMonth(year: year, month: month)).contains(dayOfMonth) {
        throw ClinicalFormatError.notAPartialDate
    }
    if dayOfMonth != nil { return .day }
    if month != nil { return .month }
    return .year
}

/// The parts of an ISO 8601 duration, nothing converted: 90 minutes stays 90 minutes, a month is never turned into days.
public struct DurationParts: Equatable, Sendable {
    public var years = 0
    public var months = 0
    public var weeks = 0
    public var days = 0
    public var hours = 0
    public var minutes = 0
    public var seconds = 0.0
    public var negative = false
}

public func durationParts(_ iso: String) throws -> DurationParts {
    let pattern = /(-)?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(\d+(?:\.\d+)?S)?)?/
    guard let match = iso.wholeMatch(of: pattern), iso.wholeMatch(of: /-?PT?/) == nil else {
        throw ClinicalFormatError.notADuration
    }
    func n(_ s: Substring?) -> Int { s.map { Int($0)! } ?? 0 }
    var parts = DurationParts()
    parts.negative = match.1 != nil
    parts.years = n(match.2)
    parts.months = n(match.3)
    parts.weeks = n(match.4)
    parts.days = n(match.5)
    parts.hours = n(match.6)
    parts.minutes = n(match.7)
    parts.seconds = match.8.map { Double($0.dropLast())! } ?? 0
    return parts
}

/// An ISO 8601 duration as an HTML-style datetime value (days, hours, minutes, seconds only; sign apart), or `nil`.
public func htmlDuration(_ iso: String) -> (datetime: String, negative: Bool)? {
    guard let parts = try? durationParts(iso) else { return nil }
    let datePart = iso.prefix { $0 != "T" }
    if parts.years != 0 || parts.months != 0 || parts.weeks != 0
        || datePart.contains(/[YW]|P\d+M/)
    {
        return nil
    }
    return (iso.hasPrefix("-") ? String(iso.dropFirst()) : iso, parts.negative)
}
