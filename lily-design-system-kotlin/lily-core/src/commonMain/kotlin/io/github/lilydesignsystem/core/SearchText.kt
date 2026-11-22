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
 * [text] cut into runs, marking the parts any term matches. Works per code point, as the TypeScript does: a code point that
 * folds to anything but exactly one code point cannot be mapped back, and then the whole text is one unmarked segment. An
 * emoji folds to itself, so it does not turn highlighting off.
 */
public fun highlightSegments(text: String, query: String): List<SearchSegment> {
    val terms = searchTerms(query)
    if (terms.isEmpty() || text.isEmpty()) return listOf(SearchSegment(text, false))
    val codePoints = text.codePointStrings()
    val folded = codePoints.map { foldText(it).codePointStrings() }
    if (folded.any { it.size != 1 }) return listOf(SearchSegment(text, false))
    val flat = folded.map { it[0] }
    val marked = BooleanArray(codePoints.size)
    for (term in terms) {
        val needle = term.codePointStrings()
        for (at in 0..flat.size - needle.size) {
            if (needle.indices.all { flat[at + it] == needle[it] }) for (k in at until at + needle.size) marked[k] = true
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

/** The text split into code points, each as a String (a surrogate pair stays together). */
private fun String.codePointStrings(): List<String> {
    val out = mutableListOf<String>()
    var i = 0
    while (i < length) {
        val n = Character.charCount(codePointAtCompat(i))
        out += substring(i, i + n)
        i += n
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
