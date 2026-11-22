// The generated tokens (bin/generate-mobile-tokens) hold the colour pairs the web themes gate: in light and dark every text
// colour is at least 4.5:1 on its fill (WCAG 1.4.3), as bin/check-theme --contrast --gate requires of the CSS.

import SwiftUI
import Testing

@testable import LilyThemes

private func luminance(_ color: Color) -> Double {
    let r = color.resolve(in: EnvironmentValues())
    func linear(_ c: Float) -> Double {
        let c = Double(c)
        return c <= 0.04045 ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4)
    }
    // Color.Resolved holds linear components already; convert back through the sRGB curve for the WCAG formula.
    func srgb(_ c: Float) -> Float {
        let x = Double(c)
        return Float(x <= 0.0031308 ? 12.92 * x : 1.055 * pow(x, 1 / 2.4) - 0.055)
    }
    return 0.2126 * linear(srgb(r.linearRed)) + 0.7152 * linear(srgb(r.linearGreen)) + 0.0722 * linear(srgb(r.linearBlue))
}

private func contrast(_ a: Color, _ b: Color) -> Double {
    let (x, y) = (luminance(a), luminance(b))
    return (max(x, y) + 0.05) / (min(x, y) + 0.05)
}

private func pairs(_ t: LilyTokens) -> [(String, Color, Color)] {
    [
        ("base-content on base-100", t.baseContent, t.base100), ("primary", t.primaryContent, t.primary),
        ("secondary", t.secondaryContent, t.secondary), ("accent", t.accentContent, t.accent),
        ("neutral", t.neutralContent, t.neutral), ("info", t.infoContent, t.info),
        ("success", t.successContent, t.success), ("warning", t.warningContent, t.warning),
        ("error", t.errorContent, t.error),
    ]
}

@Test func lightAndDarkPairsReachAA() {
    for theme in [LilyTokens.light, .dark] {
        for (name, text, fill) in pairs(theme) {
            #expect(contrast(text, fill) >= 4.5, "\(theme.slug) \(name): \(contrast(text, fill))")
        }
    }
}

@Test func everyThemeIsGeneratedOnceWithItsSlug() {
    let slugs = LilyTokens.all.map(\.slug)
    #expect(Set(slugs).count == slugs.count)
    #expect(slugs.contains("united-kingdom-government-digital-service"))
    #expect(LilyTokens.govUk.radiusBox == 0)
    #expect(LilyTokens.light.radiusBox == 8)
    #expect(LilyTokens.light.borderBorder == 1)
}

@Test func whiteIsWhiteAfterConversion() {
    #expect(abs(contrast(LilyTokens.light.base100, .white) - 1) < 0.001)
}
