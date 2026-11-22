// The Swift port of shared/search-text.ts, proved equal by shared/vectors/search-text.json (tasks.md P43-T3).
// A query is split on whitespace into terms; every term must appear (AND), in any order, ignoring case and diacritics.

import Foundation

/// Lower-case and strip combining marks, so matching ignores case and diacritics ("Café" folds to "cafe").
public func foldText(_ text: String) -> String {
    var scalars = String.UnicodeScalarView()
    for scalar in text.decomposedStringWithCanonicalMapping.unicodeScalars {
        switch scalar.properties.generalCategory {
        case .nonspacingMark, .spacingMark, .enclosingMark: continue
        default: scalars.append(scalar)
        }
    }
    return String(scalars).lowercased()
}

/// The terms of a query, folded; empty when the query is blank.
public func searchTerms(_ query: String) -> [String] {
    foldText(query).split(whereSeparator: { $0.isWhitespace }).map(String.init)
}

/// True when every term of `query` appears in `text`. An empty query matches everything.
public func matchesSearch(_ text: String, _ query: String) -> Bool {
    let terms = searchTerms(query)
    if terms.isEmpty { return true }
    let folded = Array(foldText(text).utf16)
    return terms.allSatisfy { contains(folded, Array($0.utf16)) }
}

/// A run of text and whether a search term matched it.
public struct SearchSegment: Equatable, Sendable {
    public var text: String
    public var match: Bool
    public init(text: String, match: Bool) {
        self.text = text
        self.match = match
    }
}

/// `text` cut into runs, marking the parts any term matches. Works per code point, as the TypeScript does: a code point that
/// folds to anything but exactly one code point cannot be mapped back, and then the whole text is one unmarked segment. An
/// emoji folds to itself, so it does not turn highlighting off.
public func highlightSegments(_ text: String, _ query: String) -> [SearchSegment] {
    let terms = searchTerms(query)
    if terms.isEmpty || text.isEmpty { return [SearchSegment(text: text, match: false)] }
    let scalars = Array(text.unicodeScalars)
    var flat: [Unicode.Scalar] = []
    for scalar in scalars {
        let folded = Array(foldText(String(scalar)).unicodeScalars)
        if folded.count != 1 { return [SearchSegment(text: text, match: false)] }
        flat.append(folded[0])
    }
    var marked = [Bool](repeating: false, count: scalars.count)
    for term in terms {
        let needle = Array(term.unicodeScalars)
        guard needle.count <= flat.count else { continue }
        for at in 0...(flat.count - needle.count) where Array(flat[at..<(at + needle.count)]) == needle {
            for i in at..<(at + needle.count) { marked[i] = true }
        }
    }
    var out: [SearchSegment] = []
    for (i, scalar) in scalars.enumerated() {
        if let last = out.last, last.match == marked[i] {
            out[out.count - 1].text.unicodeScalars.append(scalar)
        } else {
            out.append(SearchSegment(text: String(scalar), match: marked[i]))
        }
    }
    return out
}

/// True when `needle` (never empty: search terms are non-empty) occurs in `haystack`.
private func contains(_ haystack: [UInt16], _ needle: [UInt16]) -> Bool {
    if needle.count > haystack.count { return false }
    for at in 0...(haystack.count - needle.count) where Array(haystack[at..<(at + needle.count)]) == needle {
        return true
    }
    return false
}
