package io.github.lilydesignsystem.core

/** Canonical decomposition (NFD). Common Kotlin has no normaliser, so each target supplies one. */
internal expect fun canonicalDecomposition(text: String): String

/** True for a Unicode combining mark (general category Mn, Mc or Me). */
internal expect fun isCombiningMark(codePoint: Int): Boolean

/** User-perceived characters (extended grapheme clusters). */
internal expect fun graphemeClusters(text: String): List<String>
