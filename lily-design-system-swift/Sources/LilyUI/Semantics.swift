// The accessibility decisions of the LilyUI components, as pure functions, so they are unit-tested without a running app
// (spec/apple-swift, Testing). The components apply them outside their style, so a custom style cannot change what
// VoiceOver hears.

import SwiftUI

/// How urgently a message is announced: the mobile form of `aria-live` (spec: mobile/semantics.tsv).
public enum Politeness: String, Sendable, CaseIterable {
    /// Interrupts: `role="alert"`, `aria-live="assertive"`. Use only where the web uses it.
    case assertive
    /// Waits for the current speech: `role="status"`, `aria-live="polite"`.
    case polite
    /// Not announced; read when the user reaches it.
    case off
}

public enum LilySemantics {
    /// Joins consumer-supplied pieces of spoken text with a line break, which VoiceOver reads as a pause in every language.
    /// Lily adds no words or punctuation of its own. Empty pieces are dropped; nothing left is `nil`.
    public static func spoken(_ pieces: String?...) -> String? {
        let kept = pieces.compactMap { $0 }.filter { !$0.isEmpty }
        return kept.isEmpty ? nil : kept.joined(separator: "\n")
    }

    /// A field's accessibility hint: its error first (what to fix), then its description, then the consumer's word for
    /// "required" when the field is required and one is given.
    public static func fieldHint(description: String?, error: String?, required: Bool, requiredLabel: String?) -> String? {
        spoken(error, description, required ? requiredLabel : nil)
    }

    /// The announcement for an alert, or `nil` when it is not announced.
    public static func announcement(heading: String?, message: String, politeness: Politeness) -> AttributedString? {
        guard politeness != .off, let text = spoken(heading, message) else { return nil }
        var attributed = AttributedString(text)
        attributed.accessibilitySpeechAnnouncementPriority = politeness == .assertive ? .high : .default
        return attributed
    }

    /// Posts an announcement, if there is one.
    @MainActor public static func announce(_ text: AttributedString?) {
        guard let text else { return }
        AccessibilityNotification.Announcement(text).post()
    }
}
