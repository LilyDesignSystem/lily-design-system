import { ChangeDetectionStrategy, Component, OnInit, computed, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";
import { ipsSectionCode, ipsSectionId, ipsSectionIsRequired } from "./ips-sections";
import type { IpsSectionStatus } from "./ips-sections";

/**
 * InternationalPatientSummarySection — one section of an International Patient Summary (HL7 FHIR IPS, ISO 27269).
 *
 * A <section> named by its heading, carrying the section's key, LOINC code, status and whether the IPS requires it, as data.
 * For any status but "known" the consumer's words are shown under the heading. Content marked `narrative` is projected into a
 * <details> after the entries, rendered when `narrativeLabel` is given. See components/international-patient-summary-section.
 */
@Component({
    selector: "lily-international-patient-summary-section",
    standalone: true,
    template: `<section
      class="international-patient-summary-section {{ className() }}"
      [attr.id]="sectionId()"
      [attr.aria-labelledby]="headingId()"
      [attr.data-section]="section() || null"
      [attr.data-code]="sectionCode() || null"
      [attr.data-status]="status()"
      [attr.data-required]="isRequired() ? 'true' : null"
    >@switch (headingLevel()) {
      @case (3) {<h3 [attr.id]="headingId()" class="international-patient-summary-section-heading">{{ heading() }}</h3>}
      @case (4) {<h4 [attr.id]="headingId()" class="international-patient-summary-section-heading">{{ heading() }}</h4>}
      @case (5) {<h5 [attr.id]="headingId()" class="international-patient-summary-section-heading">{{ heading() }}</h5>}
      @case (6) {<h6 [attr.id]="headingId()" class="international-patient-summary-section-heading">{{ heading() }}</h6>}
      @default {<h2 [attr.id]="headingId()" class="international-patient-summary-section-heading">{{ heading() }}</h2>}
    }@if (status() !== "known" && statusLabel()) {<p class="international-patient-summary-section-status">{{ statusLabel() }}</p>}<ng-content />@if (narrativeLabel()) {<details class="international-patient-summary-section-narrative" [open]="narrativeOpen()"><summary>{{ narrativeLabel() }}</summary><ng-content select="[narrative]" /></details>}</section>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternationalPatientSummarySection implements OnInit {
    readonly className = input<string>("");
    /** The IPS section key, such as "allergies"; data-section. */
    readonly section = input<string>("");
    readonly heading = input<string>("");
    readonly headingLevel = input<2 | 3 | 4 | 5 | 6>(2);
    readonly status = input<IpsSectionStatus>("known");
    /** The status in words; required for any status but "known". */
    readonly statusLabel = input<string>("");
    /** The LOINC code; default the IPS code for the key. */
    readonly code = input<string | undefined>(undefined);
    /** Default whether the IPS requires the section. */
    readonly required = input<boolean | undefined>(undefined);
    readonly id = input<string | undefined>(undefined);
    /** The narrative's summary; the <details> renders only with it. */
    readonly narrativeLabel = input<string>("");
    readonly narrativeOpen = input<boolean>(false);

    protected readonly sectionId = computed(() => ipsSectionId(this.section(), this.id()));
    protected readonly headingId = computed(() => `${this.sectionId()}-heading`);
    protected readonly sectionCode = computed(() => this.code() ?? ipsSectionCode(this.section()));
    protected readonly isRequired = computed(
        () => this.required() ?? ipsSectionIsRequired(this.section()),
    );

    ngOnInit(): void {
        warnMissingProp(
            "InternationalPatientSummarySection",
            "heading",
            this.heading(),
            "A section needs a heading.",
        );
        if (this.status() !== "known") {
            warnMissingProp(
                "InternationalPatientSummarySection",
                "statusLabel",
                this.statusLabel(),
                "A section that is not known must say why, in words.",
            );
        }
    }
}
