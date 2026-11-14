import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * AllergyList: a patient's allergies and intolerances, whose status is never blank (spec/healthcare-ui item 2). For any
 * status but "known", statusLabel is the list's one item. Project `<li lily-allergy-list-item>` items. Props: AllergyList.md.
 */
@Component({
    selector: "lily-allergy-list",
    standalone: true,
    template: `<ul class="allergy-list {{ className() }}" [attr.data-status]="status() || null" [attr.aria-label]="label() || statusLabel() || null">@if (status() !== "known") {<li class="allergy-list-status">{{ statusLabel() }}</li>}<ng-content /></ul>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllergyList implements OnInit {
    readonly className = input<string>("");
    readonly status = input<"known" | "none-known" | "not-recorded" | "unavailable" | "">("");
    /** The consumer's words for the status; names the list. */
    readonly statusLabel = input<string>("");
    /** The accessible name, when it should differ from statusLabel. */
    readonly label = input<string>("");

    ngOnInit(): void {
        warnMissingProp(
            "AllergyList",
            "status",
            this.status(),
            "An allergy list must say whether allergies are known, none known, not recorded or unavailable.",
        );
        warnMissingProp(
            "AllergyList",
            "statusLabel",
            this.statusLabel(),
            "The status needs words a person can read.",
        );
    }
}
