import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * AllergyRecordList: a list of a patient's allergies and intolerances, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is the list's
 * one item. Project `<li lily-allergy-record-list-item>` items. Props: AllergyRecordList.md.
 */
@Component({
    selector: "lily-allergy-record-list",
    standalone: true,
    template: `<ul class="allergy-record-list {{ className() }}" [attr.data-status]="status() || null" [attr.aria-label]="label() || statusLabel() || null">@if (status() !== "known") {<li class="allergy-record-list-status">{{ statusLabel() }}</li>}<ng-content /></ul>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllergyRecordList implements OnInit {
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
            "AllergyRecordList",
            "status",
            this.status(),
            "A allergy record list must say whether allergies are known, none known, not recorded, unavailable, omitted or not applicable.",
        );
        warnMissingProp(
            "AllergyRecordList",
            "statusLabel",
            this.statusLabel(),
            "The status needs words a person can read.",
        );
    }
}
