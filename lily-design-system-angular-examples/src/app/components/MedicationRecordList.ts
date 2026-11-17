import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * MedicationRecordList: a list of a patient's medicines, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is the list's
 * one item. Project `<li lily-medication-record-list-item>` items. Props: MedicationRecordList.md.
 */
@Component({
    selector: "lily-medication-record-list",
    standalone: true,
    template: `<ul class="medication-record-list {{ className() }}" [attr.data-status]="status() || null" [attr.aria-label]="label() || statusLabel() || null">@if (status() !== "known") {<li class="medication-record-list-status">{{ statusLabel() }}</li>}<ng-content /></ul>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicationRecordList implements OnInit {
    readonly className = input<string>("");
    readonly status = input<
        "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" | ""
    >("");
    /** The consumer's words for the status; names the list. */
    readonly statusLabel = input<string>("");
    /** The accessible name, when it should differ from statusLabel. */
    readonly label = input<string>("");

    ngOnInit(): void {
        warnMissingProp(
            "MedicationRecordList",
            "status",
            this.status(),
            "A medication record list must say whether medicines are known, none known, not recorded, unavailable, omitted or not applicable.",
        );
        warnMissingProp(
            "MedicationRecordList",
            "statusLabel",
            this.statusLabel(),
            "The status needs words a person can read.",
        );
    }
}
