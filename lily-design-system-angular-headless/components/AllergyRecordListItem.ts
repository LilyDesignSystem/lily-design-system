import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * AllergyRecordListItem: one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status (tasks.md P28-T3, spec/healthcare-ui). Attribute selector on the native `<li>`:
 * the consumer writes `<li lily-allergy-record-list-item>`, so the host element is the list item and the list's semantics hold. Props: AllergyRecordListItem.md.
 */
@Component({
    selector: "li[lily-allergy-record-list-item]",
    standalone: true,
    template: `<span class="allergy-record-list-item-substance">{{ substance() }}</span>@if (reaction()) {{{ " " }}<span class="allergy-record-list-item-reaction">{{ reaction() }}</span>}@if (severityLabel()) {{{ " " }}<span class="allergy-record-list-item-severity">{{ severityLabel() }}</span>}@if (criticalityLabel()) {{{ " " }}<span class="allergy-record-list-item-criticality">{{ criticalityLabel() }}</span>}@if (clinicalStatusLabel()) {{{ " " }}<span class="allergy-record-list-item-clinical-status">{{ clinicalStatusLabel() }}</span>}@if (verificationStatusLabel()) {{{ " " }}<span class="allergy-record-list-item-verification-status">{{ verificationStatusLabel() }}</span>}@if (typeLabel()) {{{ " " }}<span class="allergy-record-list-item-type">{{ typeLabel() }}</span>}@if (categoryLabel()) {{{ " " }}<span class="allergy-record-list-item-category">{{ categoryLabel() }}</span>}@if (updatedLabel()) {{{ " " }}<time class="allergy-record-list-item-updated" [attr.datetime]="updated() || null">{{ updatedLabel() }}</time>}<ng-content />`,
    host: {
        "[class]": '"allergy-record-list-item " + className()',
        "[attr.data-severity]": "severity() || null",
        "[attr.data-criticality]": "criticality() || null",
        "[attr.data-clinical-status]": "clinicalStatus() || null",
        "[attr.data-verification-status]": "verificationStatus() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllergyRecordListItem implements OnInit {
    readonly className = input<string>("");
    /** what the patient reacts to; never truncated */
    readonly substance = input<string>("");
    /** the manifestation */
    readonly reaction = input<string>("");
    /** the reaction's severity (FHIR reaction.severity) */
    readonly severity = input<"mild" | "moderate" | "severe" | "">("");
    readonly severityLabel = input<string>("");
    /** the risk of a future reaction (FHIR criticality), not the severity of a past one */
    readonly criticality = input<"low" | "high" | "unable-to-assess" | "">("");
    readonly criticalityLabel = input<string>("");
    /** FHIR clinicalStatus */
    readonly clinicalStatus = input<"active" | "inactive" | "resolved" | "">("");
    readonly clinicalStatusLabel = input<string>("");
    /** FHIR verificationStatus; a refuted or entered-in-error record must never read as a confirmed one */
    readonly verificationStatus = input<
        "unconfirmed" | "presumed" | "confirmed" | "refuted" | "entered-in-error" | ""
    >("");
    readonly verificationStatusLabel = input<string>("");
    /** allergy or intolerance, in words (FHIR type) */
    readonly typeLabel = input<string>("");
    /** food, medication, environment or biologic, in words (FHIR category) */
    readonly categoryLabel = input<string>("");
    /** when the record was last updated */
    readonly updated = input<string>("");
    readonly updatedLabel = input<string>("");

    ngOnInit(): void {
        if (this.severity())
            warnMissingProp(
                "AllergyRecordListItem",
                "severityLabel",
                this.severityLabel(),
                "a status needs words a person can read, never a code alone.",
            );
        if (this.criticality())
            warnMissingProp(
                "AllergyRecordListItem",
                "criticalityLabel",
                this.criticalityLabel(),
                "a status needs words a person can read, never a code alone.",
            );
        if (this.clinicalStatus())
            warnMissingProp(
                "AllergyRecordListItem",
                "clinicalStatusLabel",
                this.clinicalStatusLabel(),
                "a status needs words a person can read, never a code alone.",
            );
        if (this.verificationStatus())
            warnMissingProp(
                "AllergyRecordListItem",
                "verificationStatusLabel",
                this.verificationStatusLabel(),
                "a status needs words a person can read, never a code alone.",
            );
    }
}
