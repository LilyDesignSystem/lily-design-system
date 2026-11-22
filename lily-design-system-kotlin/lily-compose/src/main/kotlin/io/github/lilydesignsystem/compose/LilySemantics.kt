// The accessibility decisions of the lily-compose components, as pure functions (spec/android-kotlin, Testing). The
// composables apply them with Modifier.semantics; Robolectric tests read the resulting semantics tree.
package io.github.lilydesignsystem.compose

import androidx.compose.ui.semantics.LiveRegionMode

/** How urgently a message is announced: the mobile form of `aria-live` (mobile/semantics.tsv). */
public enum class Politeness {
    /** Interrupts: `role="alert"`. Use only where the web uses it. */
    Assertive,

    /** Waits for current speech: `role="status"`. */
    Polite,

    /** Not announced. */
    Off,
}

public object LilySemantics {
    /**
     * Joins consumer-supplied pieces of spoken text with a line break, which TalkBack reads as a pause in every language. Lily
     * adds no words or punctuation of its own. Empty pieces are dropped; nothing left is `null`.
     */
    public fun spoken(vararg pieces: String?): String? =
        pieces.filterNotNull().filter { it.isNotEmpty() }.takeIf { it.isNotEmpty() }?.joinToString("\n")

    /** A field's spoken name: its label, then its description, then the consumer's word for "required" when it is required. */
    public fun fieldDescription(label: String, description: String?, required: Boolean, requiredLabel: String?): String =
        spoken(label, description, if (required) requiredLabel else null) ?: label

    /** The live region for a politeness, or `null` for [Politeness.Off]. */
    public fun liveRegion(politeness: Politeness): LiveRegionMode? = when (politeness) {
        Politeness.Assertive -> LiveRegionMode.Assertive
        Politeness.Polite -> LiveRegionMode.Polite
        Politeness.Off -> null
    }
}
