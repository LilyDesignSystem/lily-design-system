// The Kotlin port of shared/search-text.ts, proved equal by shared/vectors/search-text.json (tasks.md P43-T3).
package io.github.lilydesignsystem.core

/** Lower-case and strip combining marks, so matching ignores case and diacritics ("Café" folds to "cafe"). */
public fun foldText(text: String): String {
    val decomposed = canonicalDecomposition(text)
    val out = StringBuilder()
    var i = 0
    while (i < decomposed.length) {
        val codePoint = decomposed.codePointAtCompat(i)
        if (!isCombiningMark(codePoint)) out.appendCodePointCompat(codePoint)
        i += Character.charCount(codePoint)
    }
    return out.toString().lowercase()
}

/** The terms of a query, folded; empty when the query is blank. */
public fun searchTerms(query: String): List<String> {
    val terms = mutableListOf<String>()
    val current = StringBuilder()
    for (c in foldText(query)) {
        if (c.isWhitespace()) {
            if (current.isNotEmpty()) terms += current.toString()
            current.clear()
        } else {
            current.append(c)
        }
    }
    if (current.isNotEmpty()) terms += current.toString()
    return terms
}

/** True when every term of [query] appears in [text]. An empty query matches everything. */
public fun matchesSearch(text: String, query: String): Boolean {
    val terms = searchTerms(query)
    if (terms.isEmpty()) return true
    val folded = foldText(text)
    return terms.all { folded.contains(it) }
}

/** A run of text and whether a search term matched it. */
public data class SearchSegment(val text: String, val match: Boolean)

/**
 * [text] cut into runs, marking the parts any term matches. Works per code point, as the TypeScript does; when folding a code
 * point does not give exactly one UTF-16 unit, the whole text is one unmarked segment.
 */
public fun highlightSegments(text: String, query: String): List<SearchSegment> {
    val terms = searchTerms(query)
    if (terms.isEmpty() || text.isEmpty()) return listOf(SearchSegment(text, false))
    val codePoints = mutableListOf<String>()
    var i = 0
    while (i < text.length) {
        val cp = text.codePointAtCompat(i)
        val n = Character.charCount(cp)
        codePoints += text.substring(i, i + n)
        i += n
    }
    val folded = codePoints.map { foldText(it) }
    if (folded.any { it.length != 1 }) return listOf(SearchSegment(text, false))
    val flat = folded.joinToString("")
    val marked = BooleanArray(codePoints.size)
    for (term in terms) {
        var at = flat.indexOf(term)
        while (at != -1) {
            for (k in at until at + term.length) marked[k] = true
            at = flat.indexOf(term, at + 1)
        }
    }
    val out = mutableListOf<SearchSegment>()
    codePoints.forEachIndexed { index, c ->
        val last = out.lastOrNull()
        if (last != null && last.match == marked[index]) out[out.size - 1] = last.copy(text = last.text + c)
        else out += SearchSegment(c, marked[index])
    }
    return out
}

private fun String.codePointAtCompat(index: Int): Int {
    val high = this[index]
    if (high.isHighSurrogate() && index + 1 < length) {
        val low = this[index + 1]
        if (low.isLowSurrogate()) return ((high.code - 0xD800) shl 10) + (low.code - 0xDC00) + 0x10000
    }
    return high.code
}

private fun StringBuilder.appendCodePointCompat(codePoint: Int): StringBuilder {
    if (codePoint < 0x10000) return append(codePoint.toChar())
    val v = codePoint - 0x10000
    append((0xD800 + (v shr 10)).toChar())
    return append((0xDC00 + (v and 0x3FF)).toChar())
}

private object Character {
    fun charCount(codePoint: Int): Int = if (codePoint >= 0x10000) 2 else 1
}
