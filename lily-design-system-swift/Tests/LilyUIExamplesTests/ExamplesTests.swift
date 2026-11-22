// cspell:ignore ÉLÉMENT séverité
// Every LilyUI component has a worked example, every example renders, and the catalog search uses Lily's folding.

import SwiftUI
import Testing

@testable import LilyUIExamples

@MainActor @Test func everyShippedComponentHasOneExample() {
    let slugs = Examples.all.map(\.slug)
    #expect(Set(slugs).count == slugs.count)
    #expect(
        Set(slugs) == [
            "field", "error-summary", "summary-list", "warning-text", "alert", "badge", "tag", "card", "inset-text",
            "observation-view", "age-view", "duration-view", "allergy-record-list",
            "medication-view", "early-warning-score-view", "decision-support-card",
            "record-list", "international-patient-summary",
        ])
    #expect(Examples.all.allSatisfy { !$0.code.isEmpty && !$0.summary.isEmpty && $0.id == $0.slug })
}

@MainActor @Test func everyExampleAndTheCatalogRender() {
    for example in Examples.all {
        #expect(ImageRenderer(content: example.view.frame(width: 320)).cgImage != nil, "\(example.slug)")
        #expect(ImageRenderer(content: ExampleDetail(example: example).frame(width: 320, height: 640)).cgImage != nil)
    }
    #expect(
        ImageRenderer(content: ExampleCatalog(title: "Components", searchPrompt: "Search").frame(width: 320, height: 640))
            .cgImage != nil)
}

@MainActor @Test func catalogSearchIgnoresCaseAndAccents() {
    #expect(Examples.matching("").count == Examples.all.count)
    #expect(Examples.matching("SUMMARY LIST").map(\.slug) == ["summary-list"])
    #expect(Examples.matching("ÉLÉMENT").map(\.slug) == ["summary-list", "inset-text"])
    #expect(Examples.matching("séverité").isEmpty)
    #expect(Examples.matching("heading level").map(\.slug) == ["card"])
}

@MainActor @Test func theContactFormShowsItsErrorOnlyAfterSubmit() {
    #expect(ContactFormExample().nameError == nil)
    #expect(ContactFormExample(submitted: true).nameError == "Enter your full name")
    #expect(ContactFormExample(name: "Sam Okoro", submitted: true).nameError == nil)
    ContactFormExample().submit()
    Examples.demoAction()
    #expect(ImageRenderer(content: ContactFormExample(submitted: true).frame(width: 320)).cgImage != nil)
}

@MainActor @Test func theCatalogDestinationShowsAKnownSlugAndNothingElse() {
    #expect(ImageRenderer(content: ExampleCatalog.destination("card").frame(width: 320, height: 640)).cgImage != nil)
    #expect(ImageRenderer(content: ExampleCatalog.destination("no-such-component").frame(width: 320, height: 64)).cgImage != nil)
}
