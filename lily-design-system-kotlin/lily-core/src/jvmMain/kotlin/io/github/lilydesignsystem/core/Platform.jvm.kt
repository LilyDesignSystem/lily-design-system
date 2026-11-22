package io.github.lilydesignsystem.core

import java.text.BreakIterator
import java.text.Normalizer

internal actual fun canonicalDecomposition(text: String): String = Normalizer.normalize(text, Normalizer.Form.NFD)

internal actual fun isCombiningMark(codePoint: Int): Boolean =
    when (Character.getType(codePoint).toByte()) {
        Character.NON_SPACING_MARK, Character.COMBINING_SPACING_MARK, Character.ENCLOSING_MARK -> true
        else -> false
    }

// JDK 20 and later (and Android's ICU-backed BreakIterator) segment extended grapheme clusters, emoji sequences included.
internal actual fun graphemeClusters(text: String): List<String> {
    val iterator = BreakIterator.getCharacterInstance()
    iterator.setText(text)
    val out = mutableListOf<String>()
    var start = iterator.first()
    var end = iterator.next()
    while (end != BreakIterator.DONE) {
        out += text.substring(start, end)
        start = end
        end = iterator.next()
    }
    return out
}
