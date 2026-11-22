// The Kotlin port of shared/typeahead.ts and logicalKey from shared/direction.ts, proved equal by
// shared/vectors/typeahead.json (tasks.md P43-T3). For hardware keyboards (Modifier.onPreviewKeyEvent) on tablets,
// Chromebooks and desktop windowing.
package io.github.lilydesignsystem.core

/** The pause after which the prefix starts over, in milliseconds. */
public const val TYPEAHEAD_RESET_MS: Long = 700

/** The prefix typed so far and the time of the last key, in milliseconds. */
public data class TypeaheadState(val prefix: String = "", val at: Long = 0)

/**
 * A printable initial outside IME composition or a Ctrl, Alt or Meta shortcut: one code point (after NFC) that is not a
 * control, format or surrogate character and not a space.
 */
public fun isTypeaheadKey(
    key: String,
    ctrl: Boolean = false,
    alt: Boolean = false,
    meta: Boolean = false,
    composing: Boolean = false,
): Boolean {
    if (ctrl || alt || meta || composing) return false
    val composed = canonicalComposition(key)
    val codePoints = composed.codePointList()
    return codePoints.size == 1 && codePoints[0] != ' '.code && !isControlFormatOrSurrogate(codePoints[0])
}

/** The prefix after [key] is pressed at [now]: it grows while presses are within [resetMs] of each other. */
public fun nextTypeaheadState(
    previous: TypeaheadState,
    key: String,
    now: Long,
    resetMs: Long = TYPEAHEAD_RESET_MS,
): TypeaheadState {
    val continuing = now - previous.at <= resetMs
    return TypeaheadState((if (continuing) previous.prefix else "") + key, now)
}

/**
 * The index of the label to move to, or -1. Searches from the one after [from] and wraps. A prefix of one repeated letter is
 * that letter, so pressing it again steps through the labels starting with it. A [from] that is not -1 (no row) or a row's index
 * throws a [TypeaheadException].
 */
public fun findTypeaheadMatch(labels: List<String>, from: Int, prefix: String): Int {
    if (from < -1 || from >= labels.size) throw TypeaheadException("from", "from $from is not -1 or a row of ${labels.size}")
    val composed = canonicalComposition(prefix)
    val initials = composed.codePointList().map { foldText(codePointToString(it)) }.filter { it.isNotEmpty() }
    if (initials.isEmpty()) return -1
    val cycle = initials.all { it == initials[0] }
    val needle = if (cycle) initials[0] else foldText(prefix)
    val startOffset = if (cycle) 1 else 0
    val count = labels.size
    for (step in 0 until count) {
        val index = ((from + startOffset + step) % count + count) % count
        if (foldText(labels[index]).startsWith(needle)) return index
    }
    return -1
}

/** The key to act on in a right-to-left layout: ArrowLeft and ArrowRight swap, everything else is unchanged. */
public fun logicalKey(key: String, rtl: Boolean): String = when {
    !rtl -> key
    key == "ArrowLeft" -> "ArrowRight"
    key == "ArrowRight" -> "ArrowLeft"
    else -> key
}

private fun String.codePointList(): List<Int> {
    val out = mutableListOf<Int>()
    var i = 0
    while (i < length) {
        val high = this[i]
        if (high.isHighSurrogate() && i + 1 < length && this[i + 1].isLowSurrogate()) {
            out += ((high.code - 0xD800) shl 10) + (this[i + 1].code - 0xDC00) + 0x10000
            i += 2
        } else {
            out += high.code
            i += 1
        }
    }
    return out
}

private fun codePointToString(codePoint: Int): String =
    if (codePoint < 0x10000) codePoint.toChar().toString()
    else {
        val v = codePoint - 0x10000
        charArrayOf((0xD800 + (v shr 10)).toChar(), (0xDC00 + (v and 0x3FF)).toChar()).concatToString()
    }
