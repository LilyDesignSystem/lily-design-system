// The Swift port of shared/form-parts.ts, proved equal by shared/vectors/form-parts.json (tasks.md P62-T3): the rules of the date
// field, the quantity input, the repeatable fieldset and the step list, which LilyUI draws natively. Digits are ASCII 0 to 9, as
// in the TypeScript, whatever the script of the keyboard; a field that takes other digits converts them first.

import Foundation

public enum DateFieldPart: String, Sendable, CaseIterable { case year, month, day }

public enum DateFieldPrecision: String, Sendable, CaseIterable { case day, month, year }

public enum DateFieldOrder: String, Sendable, CaseIterable { case ymd, dmy, mdy }

/// The three parts of a date as typed; a part the precision does not ask for is "".
public struct DateParts: Equatable, Sendable {
    public var year: String
    public var month: String
    public var day: String

    public init(year: String = "", month: String = "", day: String = "") {
        self.year = year
        self.month = month
        self.day = day
    }

    public subscript(part: DateFieldPart) -> String {
        get {
            switch part {
            case .year: year
            case .month: month
            case .day: day
            }
        }
        set {
            switch part {
            case .year: year = newValue
            case .month: month = newValue
            case .day: day = newValue
            }
        }
    }
}

/// Why a form-parts function refused its input; the raw value is the TypeScript `FormPartsError.reason`.
public enum FormPartsError: String, LilyRangeError, Equatable {
    case precision, order, count, limit, index
}

/// The parts a date field asks for at a precision, in ISO 8601 order.
public func datePartsShown(_ precision: DateFieldPrecision) -> [DateFieldPart] {
    switch precision {
    case .day: [.year, .month, .day]
    case .month: [.year, .month]
    case .year: [.year]
    }
}

/// The parts in the order the reader writes them, leaving out those the precision does not ask for.
public func dateSequence(_ order: DateFieldOrder, _ precision: DateFieldPrecision) -> [DateFieldPart] {
    let sequence: [DateFieldPart] =
        switch order {
        case .ymd: [.year, .month, .day]
        case .dmy: [.day, .month, .year]
        case .mdy: [.month, .day, .year]
        }
    let shown = datePartsShown(precision)
    return sequence.filter(shown.contains)
}

private func isDigits(_ text: Substring, from: Int, to: Int) -> Bool {
    (from...to).contains(text.count) && text.allSatisfy { ("0"..."9").contains($0) }
}

/// The parts of a value of this precision (YYYY-MM-DD, YYYY-MM or YYYY), or empty parts for anything else.
public func splitDateValue(_ value: String, _ precision: DateFieldPrecision) -> DateParts {
    let pieces = value.split(separator: "-", omittingEmptySubsequences: false)
    let limits = [(1, 4), (1, 2), (1, 2)]
    guard pieces.count == datePartsShown(precision).count,
        pieces.enumerated().allSatisfy({ isDigits($1, from: limits[$0].0, to: limits[$0].1) })
    else { return DateParts() }
    return DateParts(
        year: String(pieces[0]), month: pieces.count > 1 ? String(pieces[1]) : "", day: pieces.count > 2 ? String(pieces[2]) : "")
}

private func pad(_ text: String, _ width: Int) -> String {
    String(repeating: "0", count: max(0, width - text.count)) + text
}

/// The value once every part asked for is a number, padded to ISO 8601, else "". The calendar check is `isCalendarDate`'s.
public func joinDateParts(_ parts: DateParts, _ precision: DateFieldPrecision) -> String {
    let shown = datePartsShown(precision)
    guard shown.allSatisfy({ !parts[$0].isEmpty && parts[$0].allSatisfy { ("0"..."9").contains($0) } }) else { return "" }
    let iso = [pad(parts.year, 4), pad(parts.month, 2), pad(parts.day, 2)]
    return iso.prefix(shown.count).joined(separator: "-")
}

/// Whether a value (YYYY, YYYY-MM or YYYY-MM-DD) names a real year, month or day in the Gregorian calendar.
public func isCalendarDate(_ value: String) -> Bool {
    let pieces = value.split(separator: "-", omittingEmptySubsequences: false)
    let widths = [4, 2, 2]
    guard (1...3).contains(pieces.count),
        pieces.enumerated().allSatisfy({ isDigits($1, from: widths[$0], to: widths[$0]) }),
        let year = Int(pieces[0])
    else { return false }
    guard pieces.count > 1, let month = Int(pieces[1]) else { return true }
    guard (1...12).contains(month) else { return false }
    guard pieces.count > 2, let day = Int(pieces[2]) else { return true }
    let leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
    let days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
    return (1...days).contains(day)
}

public enum QuantityProblem: String, Sendable {
    case empty
    case notANumber = "not-a-number"
    case belowMinimum = "below-minimum"
    case aboveMaximum = "above-maximum"
}

/// What is wrong with a magnitude as typed, against its unit's limits, or nil when nothing is. The decimal mark is a full stop.
public func quantityProblem(_ magnitude: String, min: Double?, max: Double?) throws(FormPartsError) -> QuantityProblem? {
    if let min, !min.isFinite { throw .limit }
    if let max, !max.isFinite { throw .limit }
    if let min, let max, min > max { throw .limit }
    let text = magnitude.trimmingCharacters(in: .whitespacesAndNewlines)
    if text.isEmpty { return .empty }
    let unsigned = text.first == "+" || text.first == "-" ? text.dropFirst() : Substring(text)
    let halves = unsigned.split(separator: ".", omittingEmptySubsequences: false)
    let digits = { (s: Substring) in s.allSatisfy { ("0"..."9").contains($0) } }
    guard (1...2).contains(halves.count), halves.allSatisfy(digits), !(halves.allSatisfy(\.isEmpty)),
        !halves[0].isEmpty || (halves.count == 2 && !halves[1].isEmpty),
        let n = Double(text.hasSuffix(".") ? text + "0" : text)
    else { return .notANumber }
    if let min, n < min { return .belowMinimum }
    if let max, n > max { return .aboveMaximum }
    return nil
}

/// Whether a repeatable fieldset may add another item: below its maximum, or always when it has none.
public func canAddItem(count: Int, max: Int?) throws(FormPartsError) -> Bool {
    guard count >= 0 else { throw .count }
    guard let max else { return true }
    guard max >= 0 else { throw .limit }
    return count < max
}

/// Whether a repeatable fieldset may remove an item: above its minimum.
public func canRemoveItem(count: Int, min: Int) throws(FormPartsError) -> Bool {
    guard count >= 0 else { throw .count }
    guard min >= 0 else { throw .limit }
    return count > min
}

public enum StepStatus: String, Sendable {
    case finished
    case inProgress = "in-progress"
    case waiting
}

/// A step's status from its index and the current step's: before it finished, at it in progress, after it waiting.
public func stepStatus(index: Int, current: Int) throws(FormPartsError) -> StepStatus {
    guard index >= 0, current >= 0 else { throw .index }
    return index < current ? .finished : index == current ? .inProgress : .waiting
}
