import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * RecordList: a list of records from one section of a patient's record, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is the list's
 * one item. Project `<li lily-record-list-item>` items. Props: RecordList.md.
 */
@Component({
    selector: "lily-record-list",
    standalone: true,
    template: `<ul class="record-list {{ className() }}" [attr.data-status]="status() || null" [attr.aria-label]="label() || statusLabel() || null">@if (coverageLabel()) {<li class="record-list-coverage">{{ coverageLabel() }}</li>}@if (status() !== "known") {<li class="record-list-status">{{ statusLabel() }}</li>}<ng-content /></ul>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordList implements OnInit {
    readonly className = input<string>("");
    readonly status = input<
        "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" | ""
    >("");
    /** The consumer's words for the status; names the list. */
    readonly statusLabel = input<string>("");
    /** The accessible name, when it should differ from statusLabel. */
    readonly label = input<string>("");
    /** What this list is a view of, in the consumer's words: its window and order, what it leaves out and why, and which sources did not answer. Rendered first, as an item of its own (spec/lessons/zoblocks). */
    readonly coverageLabel = input<string>("");

    ngOnInit(): void {
        warnMissingProp(
            "RecordList",
            "status",
            this.status(),
            "A record list must say whether records are known, none known, not recorded, unavailable, omitted or not applicable.",
        );
        warnMissingProp(
            "RecordList",
            "statusLabel",
            this.statusLabel(),
            "The status needs words a person can read.",
        );
    }
}
