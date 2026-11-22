// The rules of early-warning-score-view (components/early-warning-score-view). Lily computes nothing: scoring systems differ
// by country and population, and the score is the app's validated code. The band is always words, never colour alone.

public enum EarlyWarningScoreRules {
    public static func warnings(band: String?, bandLabel: String?) -> [String] {
        guard let band, !band.isEmpty, bandLabel?.isEmpty ?? true else { return [] }
        return ["EarlyWarningScoreView: band \(band) needs a bandLabel, or the band is colour alone"]
    }

    /// Everything spoken, in order: label, system, score, band, escalation.
    public static func spoken(label: String?, system: String?, score: String, bandLabel: String?, escalation: String?) -> String {
        [label, system, score, bandLabel, escalation].compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: "\n")
    }
}
