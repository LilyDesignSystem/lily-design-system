// The Kotlin port of shared/middle-truncation.ts, proved equal by shared/vectors/middle-truncation.json (tasks.md P43-T3).
// Compose's own TextOverflow.MiddleEllipsis is the native choice for one line of text; this is for when the app must choose
// the cut itself (a fixed number of clusters at the end, a file extension, a domain suffix).
package io.github.lilydesignsystem.core

public enum class TruncationStrategy(public val key: String) {
    /** The start and the end share what fits, the end taking the extra cluster when the count is odd. */
    Even("even"),
    /** Exactly `end` clusters are kept at the end; the start takes all the remaining room. */
    FixedEnd("fixed-end"),
    /** An even split, but at least `end` clusters are kept at the end. */
    MinEnd("min-end");

    public companion object {
        public fun fromKey(key: String): TruncationStrategy? = entries.firstOrNull { it.key == key }
    }
}

/** Split into user-perceived characters. */
public fun splitGraphemes(text: String): List<String> = graphemeClusters(text)

/** The text shortened to fit [maxWidth], or unchanged when it already fits. [ellipsis] is required: Lily has no default text. */
public fun truncateMiddle(
    text: String,
    ellipsis: String,
    maxWidth: Double,
    strategy: TruncationStrategy = TruncationStrategy.Even,
    end: Int? = null,
    measure: (String) -> Double,
): String {
    if (measure(text) <= maxWidth) return text
    val g = splitGraphemes(text)
    val n = g.size
    fun tail(count: Int) = if (count > 0) g.subList(n - count, n).joinToString("") else ""
    fun head(count: Int) = g.subList(0, count).joinToString("")
    fun clampEnd() = (end ?: 0).coerceIn(0, n)

    if (strategy == TruncationStrategy.FixedEnd) {
        val endCount = clampEnd()
        val endText = tail(endCount)
        val room = maxWidth - measure(ellipsis + endText)
        var low = 0
        var high = n - endCount
        while (low < high) {
            val middle = (low + high + 1) / 2
            if (measure(head(middle)) <= room) low = middle else high = middle - 1
        }
        return head(low) + ellipsis + endText
    }

    val minEnd = if (strategy == TruncationStrategy.MinEnd) clampEnd() else 0
    fun split(kept: Int): Pair<Int, Int> {
        val endCount = minOf(n, maxOf((kept + 1) / 2, minEnd))
        return maxOf(0, kept - endCount) to endCount
    }
    val room = maxWidth - measure(ellipsis)
    var low = 0
    var high = n
    while (low < high) {
        val middle = (low + high + 1) / 2
        val (startCount, endCount) = split(middle)
        if (measure(head(startCount) + tail(endCount)) <= room) low = middle else high = middle - 1
    }
    val (startCount, endCount) = split(low)
    return head(startCount) + ellipsis + tail(endCount)
}
