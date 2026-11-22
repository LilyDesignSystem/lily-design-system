// The Swift port of the pure part of shared/wheel-picker.ts, proved equal by shared/vectors/wheel-picker.json. The keyboard
// model of a wheel: a single-select list where the selection follows the cursor. Disabled options are skipped by every move;
// arrows wrap only with `loop`; Home, End, PageUp and PageDown never wrap. On iOS a wheel is native (Picker(.wheel)); this is
// for an app that draws its own, and for iPad hardware keyboards.

import Foundation

public struct WheelOption: Sendable, Equatable {
    public var value: String
    public var label: String
    public var disabled: Bool
    public init(value: String, label: String, disabled: Bool = false) {
        self.value = value
        self.label = label
        self.disabled = disabled
    }
}

public enum WheelMoveKey: String, Sendable {
    case arrowUp = "ArrowUp", arrowDown = "ArrowDown", home = "Home", end = "End", pageUp = "PageUp", pageDown = "PageDown"
}

public enum WheelOrientation: String, Sendable {
    case vertical, horizontal
}

/// The move a key makes on a wheel of this orientation, or nil. Horizontal wheels move with the side arrows, swapped right to left.
public func wheelMoveKey(_ key: String, orientation: WheelOrientation = .vertical, rightToLeft: Bool = false) -> WheelMoveKey? {
    switch key {
    case "Home", "End", "PageUp", "PageDown": return WheelMoveKey(rawValue: key)
    default: break
    }
    if orientation == .horizontal {
        if key == "ArrowRight" { return rightToLeft ? .arrowUp : .arrowDown }
        if key == "ArrowLeft" { return rightToLeft ? .arrowDown : .arrowUp }
        return nil
    }
    return key == "ArrowDown" || key == "ArrowUp" ? WheelMoveKey(rawValue: key) : nil
}

/// The enabled option nearest the centre of a settled wheel, or -1. A tie goes to the earlier option.
public func wheelIndexNearest(_ options: [WheelOption], middles: [Double], centre: Double) -> Int {
    var best = -1
    var bestDistance = Double.infinity
    for (index, option) in options.enumerated() where !option.disabled && index < middles.count {
        let distance = abs(middles[index] - centre)
        if distance < bestDistance {
            best = index
            bestDistance = distance
        }
    }
    return best
}

/// The index to select after `key`, or -1 when nothing can be selected. With nothing selected, a downward key or Home picks the
/// first enabled option and an upward key or End the last.
public func nextWheelIndex(
    _ options: [WheelOption], current: Int, key: WheelMoveKey, loop: Bool = false, pageSize: Double = 5
) -> Int {
    let enabled = options.indices.filter { !options[$0].disabled }
    guard let first = enabled.first, let last = enabled.last else { return -1 }
    let page = max(1, Int(pageSize.rounded(.down)))
    if key == .home { return first }
    if key == .end { return last }
    guard let position = enabled.firstIndex(of: current) else {
        return key == .arrowDown || key == .pageDown ? first : last
    }
    if key == .arrowDown { return position + 1 < enabled.count ? enabled[position + 1] : (loop ? first : current) }
    if key == .arrowUp { return position > 0 ? enabled[position - 1] : (loop ? last : current) }
    if key == .pageDown { return enabled[min(enabled.count - 1, position + page)] }
    return enabled[max(0, position - page)]  // PageUp; Home and End returned above
}

public struct WheelTypeahead: Sendable, Equatable {
    public var prefix: String
    public var at: Int
    public init(prefix: String = "", at: Int = 0) {
        self.prefix = prefix
        self.at = at
    }
}

/// The prefix after `key` at `now`: it grows while presses are within the reset time, else starts over.
public func nextWheelPrefix(_ previous: WheelTypeahead, key: String, now: Int, resetMilliseconds: Int = 700) -> WheelTypeahead {
    let continuing = !previous.prefix.isEmpty && now - previous.at <= resetMilliseconds
    return WheelTypeahead(prefix: (continuing ? previous.prefix : "") + key, at: now)
}

/// Lower-case and strip combining marks. The TypeScript uses toLocaleLowerCase; labels whose lower case depends on the locale
/// (Turkish İ) are the one place the two can differ.
private func wheelFold(_ text: String) -> String {
    String(String.UnicodeScalarView(text.decomposedStringWithCanonicalMapping.unicodeScalars.filter {
        switch $0.properties.generalCategory {
        case .nonspacingMark, .spacingMark, .enclosingMark: false
        default: true
        }
    })).lowercased()
}

/// The enabled option for the typed `prefix`, or -1. Searches from the one after `current` and wraps; one repeated letter cycles.
public func wheelTypeaheadIndex(_ options: [WheelOption], current: Int, prefix: String) -> Int {
    let initials = prefix.precomposedStringWithCanonicalMapping.unicodeScalars.map { wheelFold(String($0)) }
        .filter { !$0.isEmpty }
    guard let firstInitial = initials.first, !options.isEmpty else { return -1 }
    let cycle = initials.allSatisfy { $0 == firstInitial }
    let needle = Array((cycle ? firstInitial : wheelFold(prefix)).unicodeScalars)
    let startOffset = cycle ? 1 : 0
    let from = current < 0 ? -startOffset : current
    let count = options.count
    for step in 0..<count {
        let index = ((from + startOffset + step) % count + count) % count
        let option = options[index]
        if !option.disabled, Array(wheelFold(option.label).unicodeScalars).starts(with: needle) { return index }
    }
    return -1
}
