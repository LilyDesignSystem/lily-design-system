// Checked arithmetic: an input outside its valid range is invalid data, so it is an error, never clamped or defaulted. Each
// lily-core module throws its own subclass; [reason] is the same word the TypeScript module's RangeError carries, so the shared
// vectors (shared/vectors/*.json, "throws") check every platform against one list.
package io.github.lilydesignsystem.core

/** An input that is malformed or out of range. [reason] names which, as the TypeScript `reason` does. */
public open class LilyRangeException(public val reason: String, message: String) : IllegalArgumentException(message)

/** Thrown by [meterScale]: reason value, range, reversed, bound or units. */
public class MeterScaleException(reason: String, message: String) : LilyRangeException(reason, "meterScale: $message")

/** Thrown by [truncateMiddle]: reason end or maxWidth. */
public class TruncateMiddleException(reason: String, message: String) : LilyRangeException(reason, "truncateMiddle: $message")

/** Thrown by [findTypeaheadMatch]: reason from. */
public class TypeaheadException(reason: String, message: String) : LilyRangeException(reason, "findTypeaheadMatch: $message")

/** Thrown by the wheel-picker functions: reason current, pageSize, middles or centre. */
public class WheelPickerException(reason: String, message: String) : LilyRangeException(reason, "wheel-picker: $message")

/** Thrown by [ipsSectionId] and [ipsContents]: reason key, id, idPrefix or heading. */
public class IpsSectionsException(reason: String, message: String) : LilyRangeException(reason, "ips-sections: $message")
