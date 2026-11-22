// The rules of early-warning-score-view, the twin of LilyCore's EarlyWarningScoreRules in Swift. Lily computes nothing; the
// band is always words, never colour alone.
package io.github.lilydesignsystem.core

public object EarlyWarningScoreRules {
    public fun warnings(band: String?, bandLabel: String?): List<String> =
        if (!band.isNullOrEmpty() && bandLabel.isNullOrEmpty()) {
            listOf("EarlyWarningScoreView: band $band needs a bandLabel, or the band is colour alone")
        } else {
            emptyList()
        }

    /** Everything spoken, in order: label, system, score, band, escalation. */
    public fun spoken(label: String?, system: String?, score: String, bandLabel: String?, escalation: String?): String =
        listOf(label, system, score, bandLabel, escalation).filterNotNull().filter { it.isNotEmpty() }.joinToString("\n")
}
