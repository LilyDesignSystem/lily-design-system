// Worked examples of every LilyUI component (tasks.md P44-T5, documentation). Each is real usage with realistic words, as the
// web examples' "real usage example" rule asks; the words are English demo content passed through the same parameters an app
// localises. ExampleCatalog is the mobile form of the web apps' /components and /components/{slug} routes.

import LilyCore
import LilyUI
import SwiftUI

/// One worked example: the catalog slug, its PascalCase name, a one-line summary and the view.
public struct Example: Identifiable, Sendable {
    public let slug: String
    public let name: String
    public let summary: String
    public let code: String
    let make: @MainActor @Sendable () -> AnyView
    public var id: String { slug }

    /// The example's live view.
    @MainActor public var view: AnyView { make() }
}

struct ContactFormExample: View {
    @State private var name: String
    @State private var submitted: Bool

    init(name: String = "", submitted: Bool = false) {
        _name = State(initialValue: name)
        _submitted = State(initialValue: submitted)
    }

    var nameError: String? { submitted && name.isEmpty ? "Enter your full name" : nil }

    func submit() { submitted = true }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            if let nameError {
                ErrorSummary(title: "There is a problem", problems: [.init(nameError, action: Examples.demoAction)])
            }
            Field(
                label: "Full name", description: "As it appears on your passport", error: nameError, required: true,
                requiredLabel: "required"
            ) {
                TextField("", text: $name).textContentType(.name)
            }
            Button("Continue", action: submit)
        }
    }
}

public enum Examples {
    /// The demos' stand-in for "focus the field": a real app moves focus here.
    @MainActor static func demoAction() {}

    /// Every example, in catalog order.
    @MainActor public static let all: [Example] = [
        Example(
            slug: "field", name: "Field", summary: "A label, help text, the control and its error, read once by VoiceOver.",
            code: """
                Field(label: "Full name", description: "As it appears on your passport", error: nameError,
                      required: true, requiredLabel: "required") {
                    TextField("", text: $name).textContentType(.name)
                }
                """,
            make: { AnyView(ContactFormExample()) }),
        Example(
            slug: "error-summary", name: "ErrorSummary",
            summary: "The problems after a failed submit; VoiceOver moves to its title.",
            code: """
                ErrorSummary(title: "There is a problem", problems: [
                    .init("Enter your full name") { focusedField = .name },
                    .init("Enter a date of birth in the past") { focusedField = .dateOfBirth },
                ])
                """,
            make: {
                AnyView(
                    ErrorSummary(
                        title: "There is a problem",
                        problems: [
                            .init("Enter your full name", action: demoAction),
                            .init("Enter a date of birth in the past", action: demoAction),
                        ],
                        focusOnAppear: false))
            }),
        Example(
            slug: "summary-list", name: "SummaryList", summary: "Labelled term and value pairs, each read as one element.",
            code: """
                SummaryList(label: "Personal details") {
                    SummaryListItem(term: "Name") { Text(verbatim: "Sam Okoro") }
                    SummaryListItem(term: "Date of birth") { Text(verbatim: "14 March 1984") }
                }
                """,
            make: {
                AnyView(
                    SummaryList(label: "Personal details") {
                        SummaryListItem(term: "Name") { Text(verbatim: "Sam Okoro") }
                        SummaryListItem(term: "Date of birth") { Text(verbatim: "14 March 1984") }
                        SummaryListItem(term: "Contact details") { Text(verbatim: "Not given") }
                    })
            }),
        Example(
            slug: "warning-text", name: "WarningText", summary: "A warning whose kind is spoken first.",
            code: """
                WarningText(prefix: "Warning", text: "You can be fined up to £5,000 if you do not register.") {
                    Image(systemName: "exclamationmark.circle")
                }
                """,
            make: {
                AnyView(
                    WarningText(prefix: "Warning", text: "You can be fined up to £5,000 if you do not register.") {
                        Image(systemName: "exclamationmark.circle")
                    })
            }),
        Example(
            slug: "alert", name: "LilyAlert", summary: "A message with a severity, announced when it appears.",
            code: """
                LilyAlert(kind: .success, heading: "Appointment booked",
                          message: "We have sent a confirmation to your email.", politeness: .polite)
                """,
            make: {
                AnyView(
                    LilyAlert(
                        kind: .success, heading: "Appointment booked",
                        message: "We have sent a confirmation to your email.", politeness: .off))
            }),
        Example(
            slug: "badge", name: "Badge", summary: "A short status; a change is announced politely.",
            code: #"Badge("3", kind: .info, label: "3 unread messages")"#,
            make: { AnyView(Badge("3", kind: .info, label: "3 unread messages")) }),
        Example(
            slug: "tag", name: "Tag", summary: "A label on an item, spoken with its context.",
            code: #"Tag("High", label: "priority")"#,
            make: {
                AnyView(
                    HStack {
                        Tag("High", label: "priority")
                        Tag("Running", label: "Job status", live: true)
                    })
            }),
        Example(
            slug: "card", name: "Card", summary: "A heading at a level and its content; a label makes a named group.",
            code: """
                Card(heading: "Physiotherapy, 24 November", headingLevel: 3) {
                    Text(verbatim: "10:30 at Riverside Health Centre, with Sam Okoro.")
                }
                """,
            make: {
                AnyView(
                    Card(heading: "Physiotherapy, 24 November", headingLevel: 3) {
                        Text(verbatim: "10:30 at Riverside Health Centre, with Sam Okoro.")
                    })
            }),
        Example(
            slug: "inset-text", name: "InsetText", summary: "Supplementary text set apart, read as one element.",
            code: """
                InsetText { Text(verbatim: "It can take up to 8 weeks to register a lasting power of attorney.") }
                """,
            make: {
                AnyView(
                    InsetText { Text(verbatim: "It can take up to 8 weeks to register a lasting power of attorney.") })
            }),
        Example(
            slug: "observation-view", name: "ObservationView",
            summary: "A clinical result with its unit, flag in words, reference range, status and a hidden meter.",
            code: """
                ObservationView(value: "6.1", unit: "mmol/L", interpretation: "H", flagLabel: "High",
                                range: "3.5 to 5.5 mmol/L", label: "Potassium",
                                meterValue: 6.1, meter: meterScale(6.1, low: 3.5, high: 5.5))
                """,
            make: {
                AnyView(
                    VStack(alignment: .leading, spacing: 16) {
                        ObservationView(
                            value: "6.1", unit: "mmol/L", interpretation: "H", flagLabel: "High",
                            range: "3.5 to 5.5 mmol/L", label: "Potassium", meterValue: 6.1,
                            meter: meterScale(6.1, low: 3.5, high: 5.5))
                        ObservationView(
                            value: "138", unit: "mmol/L", status: .unavailable, statusLabel: "Result not available yet",
                            label: "Sodium")
                    })
            }),
        Example(
            slug: "age-view", name: "AgeView", summary: "An age in the app's words, with its ISO 8601 duration.",
            code: #"AgeView("5 years 2 months", duration: toIsoDuration(parts), label: "Age")"#,
            make: { AnyView(AgeView("5 years 2 months", duration: "P5Y2M", label: "Age")) }),
        Example(
            slug: "duration-view", name: "DurationView",
            summary: "A length of time in the app's words; the direction is in the words.",
            code: #"DurationView("3 days early", duration: "-P3D", label: "Delivery")"#,
            make: { AnyView(DurationView("3 days early", duration: "-P3D", label: "Delivery")) }),
    ]

    /// The examples whose name, slug or summary match `query`, with Lily's own search folding (case and accents ignored).
    @MainActor public static func matching(_ query: String) -> [Example] {
        all.filter { LilySearch.matches("\($0.name) \($0.slug) \($0.summary)", query) }
    }
}

/// A searchable list of the examples and a detail screen for each: live demo, then its code.
public struct ExampleCatalog: View {
    @State private var query = ""
    private let title: String
    private let searchPrompt: String

    /// - Parameters:
    ///   - title: the screen's title, in the app's language.
    ///   - searchPrompt: the search field's prompt, in the app's language.
    public init(title: String, searchPrompt: String) {
        self.title = title
        self.searchPrompt = searchPrompt
    }

    public var body: some View {
        NavigationStack {
            List(Examples.matching(query)) { example in
                NavigationLink(value: example.slug) {
                    VStack(alignment: .leading) {
                        Text(verbatim: example.name).font(.headline)
                        Text(verbatim: example.summary).font(.subheadline)
                    }
                }
            }
            .navigationTitle(Text(verbatim: title))
            .navigationDestination(for: String.self, destination: Self.destination)
            .searchable(text: $query, prompt: Text(verbatim: searchPrompt))
        }
    }
}

extension ExampleCatalog {
    /// The detail screen for a slug, or nothing for an unknown one.
    @ViewBuilder static func destination(_ slug: String) -> some View {
        if let example = Examples.all.first(where: { $0.slug == slug }) { ExampleDetail(example: example) }
    }
}

/// One example: its live view, then its code in a horizontally scrolling block.
public struct ExampleDetail: View {
    let example: Example

    public init(example: Example) { self.example = example }

    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                Text(verbatim: example.summary)
                example.view
                ScrollView(.horizontal) {
                    Text(verbatim: example.code).font(.system(.footnote, design: .monospaced)).textSelection(.enabled)
                }
            }
            .padding()
        }
        .navigationTitle(Text(verbatim: example.name))
    }
}
