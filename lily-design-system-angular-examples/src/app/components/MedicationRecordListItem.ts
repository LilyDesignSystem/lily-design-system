import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * MedicationRecordListItem: one medicine in a medication record list, with its status and when it applies (tasks.md P28-T3, spec/healthcare-ui). Attribute selector on the native `<li>`:
 * the consumer writes `<li lily-medication-record-list-item>`, so the host element is the list item and the list's semantics hold. Props: MedicationRecordListItem.md.
 */
@Component({
    selector: "li[lily-medication-record-list-item]",
    standalone: true,
    template: `@if (subjectLabel()) {<span class="medication-record-list-item-subject">{{ subjectLabel() }}</span>{{ " " }}}<ng-content />@if (statusLabel()) {{{ " " }}<span class="medication-record-list-item-status">{{ statusLabel() }}</span>}@if (effectiveLabel()) {{{ " " }}<time class="medication-record-list-item-effective" [attr.datetime]="effective() || null">{{ effectiveLabel() }}</time>}`,
    host: {
        "[class]": '"medication-record-list-item " + className()',
        "[attr.data-status]": "status() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicationRecordListItem implements OnInit {
    readonly className = input<string>("");
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    readonly subjectLabel = input<string>("");
    /** FHIR MedicationStatement status */
    readonly status = input<
        | "active"
        | "completed"
        | "entered-in-error"
        | "intended"
        | "stopped"
        | "on-hold"
        | "unknown"
        | "not-taken"
        | ""
    >("");
    readonly statusLabel = input<string>("");
    /** when the medicine applies, for <time datetime> */
    readonly effective = input<string>("");
    readonly effectiveLabel = input<string>("");

    ngOnInit(): void {
        if (this.status())
            warnMissingProp(
                "MedicationRecordListItem",
                "statusLabel",
                this.statusLabel(),
                "a status needs words a person can read, never a code alone.",
            );
    }
}
