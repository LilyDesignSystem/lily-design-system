// The Kotlin port of the pure part of shared/wheel-picker.ts, proved equal by shared/vectors/wheel-picker.json. The keyboard
// model of a wheel: selection follows the cursor, disabled options are skipped, arrows wrap only with `loop`, Home, End, PageUp
// and PageDown never wrap. Compose has no wheel, so lily-compose's WheelPicker (mobile/components-mobile.tsv) is built on this.
package io.github.lilydesignsystem.core

public data class WheelOption(val value: String, val label: String, val disabled: Boolean = false)

public enum class WheelMoveKey(public val key: String) {
    ArrowUp("ArrowUp"), ArrowDown("ArrowDown"), Home("Home"), End("End"), PageUp("PageUp"), PageDown("PageDown");

    public companion object {
        public fun fromKey(key: String): WheelMoveKey? = entries.firstOrNull { it.key == key }
    }
}

public enum class WheelOrientation { Vertical, Horizontal }

/** The move a key makes on a wheel of this orientation, or null. Horizontal wheels move with the side arrows, swapped in RTL. */
public fun wheelMoveKey(key: String, orientation: WheelOrientation = WheelOrientation.Vertical, rtl: Boolean = false): WheelMoveKey? =
    when {
        key == "Home" || key == "End" || key == "PageUp" || key == "PageDown" -> WheelMoveKey.fromKey(key)
        orientation == WheelOrientation.Horizontal -> when (key) {
            "ArrowRight" -> if (rtl) WheelMoveKey.ArrowUp else WheelMoveKey.ArrowDown
            "ArrowLeft" -> if (rtl) WheelMoveKey.ArrowDown else WheelMoveKey.ArrowUp
            else -> null
        }
        key == "ArrowDown" || key == "ArrowUp" -> WheelMoveKey.fromKey(key)
        else -> null
    }

/** The enabled option nearest the centre of a settled wheel, or -1. A tie goes to the earlier option. */
public fun wheelIndexNearest(options: List<WheelOption>, middles: List<Double>, centre: Double): Int {
    var best = -1
    var bestDistance = Double.POSITIVE_INFINITY
    options.forEachIndexed { index, option ->
        if (option.disabled || index >= middles.size) return@forEachIndexed
        val distance = kotlin.math.abs(middles[index] - centre)
        if (distance < bestDistance) {
            best = index
            bestDistance = distance
        }
    }
    return best
}

/** The index to select after [key], or -1 when nothing can be selected. */
public fun nextWheelIndex(
    options: List<WheelOption>,
    current: Int,
    key: WheelMoveKey,
    loop: Boolean = false,
    pageSize: Double = 5.0,
): Int {
    val enabled = options.indices.filter { !options[it].disabled }
    if (enabled.isEmpty()) return -1
    val first = enabled.first()
    val last = enabled.last()
    val page = maxOf(1, kotlin.math.floor(pageSize).toInt())
    if (key == WheelMoveKey.Home) return first
    if (key == WheelMoveKey.End) return last
    val position = enabled.indexOf(current)
    if (position == -1) return if (key == WheelMoveKey.ArrowDown || key == WheelMoveKey.PageDown) first else last
    if (key == WheelMoveKey.ArrowDown) return if (position + 1 < enabled.size) enabled[position + 1] else if (loop) first else current
    if (key == WheelMoveKey.ArrowUp) return if (position > 0) enabled[position - 1] else if (loop) last else current
    if (key == WheelMoveKey.PageDown) return enabled[minOf(enabled.size - 1, position + page)]
    return enabled[maxOf(0, position - page)] // PageUp; Home and End returned above
}

public data class WheelTypeahead(val prefix: String = "", val at: Long = 0)

/** The prefix after [key] at [now]: it grows while presses are within the reset time, else starts over. */
public fun nextWheelPrefix(previous: WheelTypeahead, key: String, now: Long, resetMs: Long = 700): WheelTypeahead {
    val continuing = previous.prefix.isNotEmpty() && now - previous.at <= resetMs
    return WheelTypeahead((if (continuing) previous.prefix else "") + key, now)
}

/** The enabled option for the typed [prefix], or -1. Searches from the one after [current] and wraps; one repeated letter cycles. */
public fun wheelTypeaheadIndex(options: List<WheelOption>, current: Int, prefix: String): Int {
    val initials = initialsOf(prefix).map { foldText(it) }.filter { it.isNotEmpty() }
    if (initials.isEmpty() || options.isEmpty()) return -1
    val cycle = initials.all { it == initials[0] }
    val needle = if (cycle) initials[0] else foldText(prefix)
    val startOffset = if (cycle) 1 else 0
    val from = if (current < 0) -startOffset else current
    val count = options.size
    for (step in 0 until count) {
        val index = ((from + startOffset + step) % count + count) % count
        val option = options[index]
        if (!option.disabled && foldText(option.label).startsWith(needle)) return index
    }
    return -1
}

/** The code points of [text] after NFC, each as a String. */
private fun initialsOf(text: String): List<String> {
    val composed = canonicalComposition(text)
    val out = mutableListOf<String>()
    var i = 0
    while (i < composed.length) {
        val n = if (composed[i].isHighSurrogate() && i + 1 < composed.length && composed[i + 1].isLowSurrogate()) 2 else 1
        out += composed.substring(i, i + n)
        i += n
    }
    return out
}
