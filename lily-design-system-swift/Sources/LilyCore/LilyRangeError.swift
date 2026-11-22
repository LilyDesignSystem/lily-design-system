// Checked arithmetic: an input outside its valid range is invalid data, so it is an error, never clamped or defaulted. Each
// LilyCore module throws its own error enum; `reason` is the same word the TypeScript module's RangeError carries, so the shared
// vectors (shared/vectors/*.json, "throws") check every platform against one list.

public protocol LilyRangeError: Error, Sendable {
    /// Which input was invalid, as the TypeScript `reason` names it.
    var reason: String { get }
}

extension LilyRangeError where Self: RawRepresentable, RawValue == String {
    public var reason: String { rawValue }
}
