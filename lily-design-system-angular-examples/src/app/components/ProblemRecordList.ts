import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * ProblemRecordList: a list of a patient's problems and conditions, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is the list's
 * one item. Project `<li lily-problem-record-list-item>` items. Props: ProblemRecordList.md.
 */
@Component({
    selector: "lily-problem-record-list",
    standalone: true,
    template: `<ul class="problem-record-list {{ className() }}" [attr.data-status]="status() || null" [attr.aria-label]="label() || statusLabel() || null">@if (status() !== "known") {<li class="problem-record-list-status">{{ statusLabel() }}</li>}<ng-content /></ul>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemRecordList implements OnInit {
    readonly className = input<string>("");
    readonly status = input<
        "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | ""
    >("");
    /** The consumer's words for the status; names the list. */
    readonly statusLabel = input<string>("");
    /** The accessible name, when it should differ from statusLabel. */
    readonly label = input<string>("");

    ngOnInit(): void {
        warnMissingProp(
            "ProblemRecordList",
            "status",
            this.status(),
            "A problem record list must say whether problems are known, none known, not recorded, unavailable or omitted.",
        );
        warnMissingProp(
            "ProblemRecordList",
            "statusLabel",
            this.statusLabel(),
            "The status needs words a person can read.",
        );
    }
}
