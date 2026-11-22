// The Swift port of shared/typeahead.ts and logicalKey from shared/direction.ts, proved equal by
// shared/vectors/typeahead.json (tasks.md P43-T3). Type-ahead as the WAI-ARIA APG listbox and tree describe it: letters typed
// in quick succession form one prefix, the prefix resets after a pause, and the same letter again cycles. For iPad hardware
// keyboards (`.onKeyPress`) and any list a Lily component lets the user type into.

import Foundation

/// The pause after which the prefix starts over, in milliseconds.
public let typeaheadResetMilliseconds = 700

public struct TypeaheadState: Equatable, Sendable {
    public var prefix: String
    /// The time of the last key, in milliseconds.
    public var at: Int
    public init(prefix: String = "", at: Int = 0) {
        self.prefix = prefix
        self.at = at
    }
}

/// A printable initial outside IME composition or a Control, Option or Command shortcut: one code point (after NFC) that is
/// not a control, format or surrogate character and not a space.
public func isTypeaheadKey(
    _ key: String, control: Bool = false, option: Bool = false, command: Bool = false, composing: Bool = false
) -> Bool {
    if control || option || command || composing { return false }
    let scalars = Array(key.precomposedStringWithCanonicalMapping.unicodeScalars)
    guard scalars.count == 1, scalars[0] != " " else { return false }
    switch scalars[0].properties.generalCategory {
    case .control, .format, .surrogate: return false
    default: return true
    }
}

/// The prefix after `key` is pressed at `now`: it grows while presses are within `resetMilliseconds` of each other.
public func nextTypeaheadState(
    _ previous: TypeaheadState, key: String, now: Int, resetMilliseconds: Int = typeaheadResetMilliseconds
) -> TypeaheadState {
    let continuing = now - previous.at <= resetMilliseconds
    return TypeaheadState(prefix: (continuing ? previous.prefix : "") + key, at: now)
}

/// The index of the label to move to, or -1. Searches from the one after `from` and wraps. A prefix of one repeated letter is
/// that letter, so pressing it again steps through the labels starting with it. Compares Unicode scalars, as the TypeScript
/// compares code units, so a Hangul initial matches the syllables that start with it.
/// Why `findTypeaheadMatch` refused its input; the raw value is the TypeScript `TypeaheadError.reason`.
public enum TypeaheadError: String, LilyRangeError, Equatable {
    case from
}

/// `from` must be -1 (no row) or a row's index, or it throws.
public func findTypeaheadMatch(_ labels: [String], from: Int, prefix: String) throws(TypeaheadError) -> Int {
    guard from >= -1, from < labels.count else { throw .from }
    let initials = prefix.precomposedStringWithCanonicalMapping.unicodeScalars.map { foldText(String($0)) }
        .filter { !$0.isEmpty }
    guard let first = initials.first else { return -1 }
    let cycle = initials.allSatisfy { $0 == first }
    let needle = Array((cycle ? first : foldText(prefix)).unicodeScalars)
    let startOffset = cycle ? 1 : 0
    let count = labels.count
    for step in 0..<count {
        let index = ((from + startOffset + step) % count + count) % count
        if Array(foldText(labels[index]).unicodeScalars).starts(with: needle) { return index }
    }
    return -1
}

/// The key to act on in a right-to-left layout: ArrowLeft and ArrowRight swap, everything else is unchanged. SwiftUI's own
/// `.onMoveCommand` already gives leading and trailing; this is for code that reads raw arrow keys.
public func logicalKey(_ key: String, rightToLeft: Bool) -> String {
    guard rightToLeft else { return key }
    switch key {
    case "ArrowLeft": return "ArrowRight"
    case "ArrowRight": return "ArrowLeft"
    default: return key
    }
}
