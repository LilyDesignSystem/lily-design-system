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

/// A heading level, 2 to 6 as on the web. A type rather than an Int, so a level out of range cannot be written (no clamp).
public enum HeadingLevel: Int, Sendable, CaseIterable {
    case h2 = 2, h3, h4, h5, h6
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

    /// A field's error changed: announce the new one assertively, as the web's role="alert" on the error does. A cleared
    /// error is not announced.
    @MainActor public static func errorChanged(from _: String?, to newError: String?) {
        guard let newError else { return }
        announce(announcement(heading: nil, message: newError, politeness: .assertive))
    }

    /// A badge's spoken name: the label when given, else the visible text.
    public static func badgeLabel(text: String, label: String?) -> String {
        if let label, !label.isEmpty { return label }
        return text
    }

    /// A tag's spoken name: the text then the label, or, when live, the label alone (its text is the value).
    public static func tagLabel(text: String, label: String, live: Bool) -> String {
        live ? label : (spoken(text, label) ?? text)
    }

    /// The accessibility heading level for a Lily heading level.
    public static func headingLevel(_ level: HeadingLevel) -> AccessibilityHeadingLevel {
        switch level {
        case .h2: .h2
        case .h3: .h3
        case .h4: .h4
        case .h5: .h5
        case .h6: .h6
        }
    }

    /// Development warnings: printed in debug builds, for the developer, never shown to the user (the web's dev-warning).
    public static func warn(_ messages: [String]) {
        #if DEBUG
            for message in messages { print("Lily: " + message) }
        #endif
    }

    /// Posts an announcement, if there is one.
    @MainActor public static func announce(_ text: AttributedString?) {
        guard let text else { return }
        AccessibilityNotification.Announcement(text).post()
    }
}
