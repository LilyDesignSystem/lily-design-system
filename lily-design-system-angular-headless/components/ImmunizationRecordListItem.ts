import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * ImmunizationRecordListItem: one immunization in an immunization record list, with vaccine, date, dose and status (tasks.md P28-T3, spec/healthcare-ui). Attribute selector on the native `<li>`:
 * the consumer writes `<li lily-immunization-record-list-item>`, so the host element is the list item and the list's semantics hold. Props: ImmunizationRecordListItem.md.
 */
@Component({
    selector: "li[lily-immunization-record-list-item]",
    standalone: true,
    template: `<span class="immunization-record-list-item-vaccine">{{ vaccine() }}</span>@if (occurrenceLabel()) {{{ " " }}<time class="immunization-record-list-item-occurrence" [attr.datetime]="occurrence() || null">{{ occurrenceLabel() }}</time>}@if (doseNumberLabel()) {{{ " " }}<span class="immunization-record-list-item-dose-number">{{ doseNumberLabel() }}</span>}@if (statusLabel()) {{{ " " }}<span class="immunization-record-list-item-status">{{ statusLabel() }}</span>}@if (lotNumber()) {{{ " " }}<span class="immunization-record-list-item-lot-number">{{ lotNumber() }}</span>}<ng-content />`,
    host: {
        "[class]": '"immunization-record-list-item " + className()',
        "[attr.data-status]": "status() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImmunizationRecordListItem implements OnInit {
    readonly className = input<string>("");
    /** the vaccine given; never truncated */
    readonly vaccine = input<string>("");
    /** when it was given, for <time datetime> */
    readonly occurrence = input<string>("");
    readonly occurrenceLabel = input<string>("");
    /** the dose in words ("Dose 2 of 2") */
    readonly doseNumberLabel = input<string>("");
    /** FHIR Immunization status */
    readonly status = input<"completed" | "entered-in-error" | "not-done" | "">("");
    readonly statusLabel = input<string>("");
    /** the vaccine's lot number */
    readonly lotNumber = input<string>("");

    ngOnInit(): void {
        if (this.status())
            warnMissingProp(
                "ImmunizationRecordListItem",
                "statusLabel",
                this.statusLabel(),
                "a status needs words a person can read, never a code alone.",
            );
    }
}
