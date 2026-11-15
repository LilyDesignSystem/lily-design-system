import { ChangeDetectionStrategy, Component, OnInit, computed, input } from "@angular/core";
import { warnMissingName, warnMissingProp } from "./dev-warning";
import { ipsContents } from "./ips-sections";
import type { IpsSectionEntry } from "./ips-sections";
import { InternationalPatientSummarySection } from "./InternationalPatientSummarySection";

/**
 * InternationalPatientSummary — an International Patient Summary (HL7 FHIR IPS, ISO 27269) laid out for a clinician.
 *
 * An <article> holding content marked `banner`, a contents navigation, the sections (default content) and content marked
 * `details`. Structure only: Lily parses no FHIR. The root takes the sections as plain data too, and adds each missing required
 * section (medications, allergies, problems) with the consumer's heading and omittedLabel, after the given sections, with a
 * contents link to it. Angular cannot see whether content was projected, so the banner and details wrappers always render.
 * See components/international-patient-summary.
 */
@Component({
    selector: "lily-international-patient-summary",
    standalone: true,
    imports: [InternationalPatientSummarySection],
    template: `<article class="international-patient-summary {{ className() }}" [attr.aria-label]="label() || null"><div class="international-patient-summary-banner"><ng-content select="[banner]" /></div>@if (contentsLabel()) {<nav class="international-patient-summary-contents" [attr.aria-label]="contentsLabel()"><ol>@for (entry of contents(); track entry.id) {<li [attr.data-section]="entry.key" [attr.data-status]="entry.status"><a [attr.href]="'#' + entry.id">{{ entry.heading }}</a></li>}</ol></nav>}<div class="international-patient-summary-sections"><ng-content />@for (entry of added(); track entry.id) {<lily-international-patient-summary-section [section]="entry.key" [id]="entry.id" [heading]="entry.heading" [headingLevel]="headingLevel()" status="omitted" [statusLabel]="omittedLabel()" />}</div><div class="international-patient-summary-details"><ng-content select="[details]" /></div></article>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternationalPatientSummary implements OnInit {
    readonly className = input<string>("");
    readonly label = input<string>("");
    /** The sections the consumer renders, in document order. */
    readonly sections = input<IpsSectionEntry[]>([]);
    /** Headings for an added, missing required section. */
    readonly requiredHeadings = input<
        { medications: string; allergies: string; problems: string } | undefined
    >(undefined);
    /** The words an added section shows, such as "Section missing from document". */
    readonly omittedLabel = input<string>("");
    /** Names the contents navigation; without it there is none. */
    readonly contentsLabel = input<string>("");
    readonly headingLevel = input<2 | 3 | 4 | 5 | 6>(2);
    /** Section ids are {idPrefix}-{key}; give each summary on a page its own. */
    readonly idPrefix = input<string | undefined>(undefined);

    protected readonly contents = computed(() =>
        ipsContents(this.sections(), this.requiredHeadings() ?? {}, this.idPrefix()),
    );
    protected readonly added = computed(() => this.contents().filter((entry) => entry.added));

    ngOnInit(): void {
        warnMissingName("InternationalPatientSummary", this.label());
        warnMissingProp(
            "InternationalPatientSummary",
            "omittedLabel",
            this.omittedLabel(),
            "A missing required section must be shown in words.",
        );
        warnMissingProp(
            "InternationalPatientSummary",
            "requiredHeadings",
            this.requiredHeadings(),
            "A missing required section needs a heading.",
        );
    }
}
