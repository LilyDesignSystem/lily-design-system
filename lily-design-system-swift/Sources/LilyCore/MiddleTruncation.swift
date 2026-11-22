// The Swift port of shared/middle-truncation.ts, proved equal by shared/vectors/middle-truncation.json (tasks.md P43-T3).
// Shorten a string by cutting out the middle, keeping the start and the end ("report-fi…q3.pdf"). Works on grapheme clusters
// (Swift Characters), so it never splits a surrogate pair, a combining sequence or an emoji. The caller supplies `measure`.
// SwiftUI's own `.truncationMode(.middle)` is the native choice for a single line of text; this is for when the app must
// choose the cut itself (a fixed number of clusters at the end, a file extension, a domain suffix).

public enum TruncationStrategy: String, Sendable {
    /// The start and the end share what fits, the end taking the extra cluster when the count is odd.
    case even
    /// Exactly `end` clusters are kept at the end; the start takes all the remaining room.
    case fixedEnd = "fixed-end"
    /// An even split, but at least `end` clusters are kept at the end.
    case minEnd = "min-end"

    /// The keys, in the order the TypeScript documents them.
    public static var allKeys: [String] { [Self.even, .fixedEnd, .minEnd].map(\.rawValue) }
}

/// Split into user-perceived characters.
public func splitGraphemes(_ text: String) -> [String] {
    text.map(String.init)
}

/// Why `truncateMiddle` refused its input; the raw value is the TypeScript `TruncateMiddleError.reason`.
public enum TruncateMiddleError: String, LilyRangeError, Equatable {
    case end, maxWidth
}

/// The text shortened to fit `maxWidth`, or unchanged when it already fits. `ellipsis` is required: Lily has no default text.
/// `maxWidth` must be finite and at least 0, and `end` (0 when not given) a count from 0 to the text's clusters, or it throws.
public func truncateMiddle(
    _ text: String,
    ellipsis: String,
    maxWidth: Double,
    strategy: TruncationStrategy = .even,
    end: Int? = nil,
    measure: (String) -> Double
) throws(TruncateMiddleError) -> String {
    guard maxWidth.isFinite, maxWidth >= 0 else { throw .maxWidth }
    if let end, end < 0 { throw .end }
    if measure(text) <= maxWidth { return text }
    let g = splitGraphemes(text)
    let n = g.count
    func tail(_ count: Int) -> String { count > 0 ? g[(n - count)...].joined() : "" }
    func head(_ count: Int) -> String { g[..<count].joined() }
    let checkedEnd = end ?? 0
    if checkedEnd > n { throw .end }

    if strategy == .fixedEnd {
        let endCount = checkedEnd
        let endText = tail(endCount)
        let room = maxWidth - measure(ellipsis + endText)
        var low = 0
        var high = n - endCount
        while low < high {
            let middle = (low + high + 1) / 2
            if measure(head(middle)) <= room { low = middle } else { high = middle - 1 }
        }
        return head(low) + ellipsis + endText
    }

    let minEnd = strategy == .minEnd ? checkedEnd : 0
    func split(_ kept: Int) -> (Int, Int) {
        let endCount = min(n, max((kept + 1) / 2, minEnd))
        return (max(0, kept - endCount), endCount)
    }
    let room = maxWidth - measure(ellipsis)
    var low = 0
    var high = n
    while low < high {
        let middle = (low + high + 1) / 2
        let (startCount, endCount) = split(middle)
        if measure(head(startCount) + tail(endCount)) <= room { low = middle } else { high = middle - 1 }
    }
    let (startCount, endCount) = split(low)
    return head(startCount) + ellipsis + tail(endCount)
}
