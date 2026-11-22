// InternationalPatientSummary and InternationalPatientSummarySection (components/international-patient-summary*). Structure
// only: Lily parses no FHIR. The summary is a labelled container: the banner, the contents (buttons that call back with a
// section key, for the app to scroll to it), the app's sections, an omitted section for each missing required one (so a gap
// is never silent), then the details. A section is a header at its level with its status in words and an optional narrative
// in a native disclosure.

import LilyCore
import SwiftUI

public struct InternationalPatientSummarySection<Content: View, Narrative: View>: View {
    let section: String
    let heading: String
    let headingLevel: HeadingLevel
    let status: IpsSectionStatus
    let statusLabel: String?
    let statusPlacement: IpsStatusPlacement
    let narrativeLabel: String?
    let hasNarrative: Bool
    let content: Content
    let narrative: Narrative
    @State private var narrativeOpen: Bool

    /// - Parameters:
    ///   - section: the IPS section key ("allergies").
    ///   - heading: the heading, in the app's words. Required.
    ///   - headingLevel: 2 to 6, as on the web (default `.h2`).
    ///   - status, statusLabel: the section's status and its words (required for any but known, unless `statusPlacement`
    ///     is `.list`, where the record list inside says it).
    ///   - narrativeLabel, narrativeOpen, narrative: the author's narrative, behind a disclosure named by `narrativeLabel`.
    ///   - content: the entries, usually a record list.
    public init(
        section: String, heading: String, headingLevel: HeadingLevel = .h2, status: IpsSectionStatus = .known,
        statusLabel: String? = nil, statusPlacement: IpsStatusPlacement = .heading, narrativeLabel: String? = nil,
        narrativeOpen: Bool = false, @ViewBuilder content: () -> Content, @ViewBuilder narrative: () -> Narrative
    ) {
        self.section = section
        self.heading = heading
        self.headingLevel = headingLevel
        self.status = status
        self.statusLabel = statusLabel
        self.statusPlacement = statusPlacement
        self.narrativeLabel = narrativeLabel
        self.content = content()
        self.narrative = narrative()
        self.hasNarrative = Narrative.self != EmptyView.self
        _narrativeOpen = State(initialValue: narrativeOpen)
        LilySemantics.warn(
            IpsRules.sectionWarnings(
                heading: heading, status: status, statusLabel: statusLabel, placement: statusPlacement,
                hasNarrative: hasNarrative, narrativeLabel: narrativeLabel))
    }

    /// The LOINC code of the section, for the app's use.
    public var code: String? { ipsSectionCode(section) }

    public var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(verbatim: heading)
                .font(.title3.bold())
                .accessibilityAddTraits(.isHeader)
                .accessibilityHeading(LilySemantics.headingLevel(headingLevel))
            if IpsRules.showsStatusLine(status, placement: statusPlacement), let statusLabel {
                Text(verbatim: statusLabel)
            }
            content
            if hasNarrative {
                DisclosureGroup(isExpanded: $narrativeOpen) { narrative } label: {
                    Text(verbatim: narrativeLabel ?? "")
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .contain)
    }
}

extension InternationalPatientSummarySection where Narrative == EmptyView {
    public init(
        section: String, heading: String, headingLevel: HeadingLevel = .h2, status: IpsSectionStatus = .known,
        statusLabel: String? = nil, statusPlacement: IpsStatusPlacement = .heading, @ViewBuilder content: () -> Content
    ) {
        self.init(
            section: section, heading: heading, headingLevel: headingLevel, status: status, statusLabel: statusLabel,
            statusPlacement: statusPlacement, content: content, narrative: { EmptyView() })
    }
}

extension InternationalPatientSummarySection where Content == EmptyView, Narrative == EmptyView {
    /// A section with no entries: its status words are all it says.
    public init(section: String, heading: String, headingLevel: HeadingLevel = .h2, status: IpsSectionStatus, statusLabel: String) {
        self.init(
            section: section, heading: heading, headingLevel: headingLevel, status: status, statusLabel: statusLabel,
            content: { EmptyView() }, narrative: { EmptyView() })
    }
}

public struct InternationalPatientSummary<Banner: View, Sections: View, Details: View>: View {
    let label: String
    let sections: [IpsSectionEntry]
    let contents: [IpsContentsEntry]
    let omittedLabel: String
    let contentsLabel: String?
    let headingLevel: HeadingLevel
    let onSelectSection: @MainActor (String) -> Void
    let banner: Banner
    let content: Sections
    let details: Details

    /// - Parameters:
    ///   - label: the summary's accessible name. Required.
    ///   - sections: the sections the app renders, as plain data, in document order.
    ///   - requiredHeadings: headings for an added, missing required section (medications, allergies, problems).
    ///   - omittedLabel: the words an added section shows ("Section missing from document").
    ///   - contentsLabel: names the contents; without it there are none.
    ///   - headingLevel: the heading level of an added section (default `.h2`).
    ///   - onSelectSection: called with a section key when its contents entry is chosen; scroll to it in the app.
    /// - Throws: `IpsSectionsError` for a missing required section with no heading, or an empty key or id.
    public init(
        label: String, sections: [IpsSectionEntry], requiredHeadings: [String: String], omittedLabel: String,
        contentsLabel: String? = nil, headingLevel: HeadingLevel = .h2, onSelectSection: @escaping @MainActor (String) -> Void = { _ in },
        @ViewBuilder banner: () -> Banner, @ViewBuilder content: () -> Sections, @ViewBuilder details: () -> Details
    ) throws(IpsSectionsError) {
        self.label = label
        self.sections = sections
        self.contents = try ipsContents(sections, requiredHeadings: requiredHeadings)
        self.omittedLabel = omittedLabel
        self.contentsLabel = contentsLabel
        self.headingLevel = headingLevel
        self.onSelectSection = onSelectSection
        self.banner = banner()
        self.content = content()
        self.details = details()
        LilySemantics.warn(
            IpsRules.summaryWarnings(label: label, omittedLabel: omittedLabel, requiredHeadings: requiredHeadings))
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            banner
            if let contentsLabel {
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(contents, id: \.key) { entry in
                        Button(entry.heading) { onSelectSection(entry.key) }.buttonStyle(.borderless)
                    }
                }
                .accessibilityElement(children: .contain)
                .accessibilityLabel(Text(verbatim: contentsLabel))
            }
            content
            ForEach(contents.filter(\.added), id: \.key) { entry in
                InternationalPatientSummarySection(
                    section: entry.key, heading: entry.heading, headingLevel: headingLevel, status: .omitted,
                    statusLabel: omittedLabel)
            }
            details
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text(verbatim: label))
    }
}

extension InternationalPatientSummary where Banner == EmptyView, Details == EmptyView {
    public init(
        label: String, sections: [IpsSectionEntry], requiredHeadings: [String: String], omittedLabel: String,
        contentsLabel: String? = nil, headingLevel: HeadingLevel = .h2, onSelectSection: @escaping @MainActor (String) -> Void = { _ in },
        @ViewBuilder content: () -> Sections
    ) throws(IpsSectionsError) {
        try self.init(
            label: label, sections: sections, requiredHeadings: requiredHeadings, omittedLabel: omittedLabel,
            contentsLabel: contentsLabel, headingLevel: headingLevel, onSelectSection: onSelectSection,
            banner: { EmptyView() }, content: content, details: { EmptyView() })
    }
}
