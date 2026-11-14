import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * ProcedureRecordList: a list of a patient's procedures, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is the list's
 * one item. Project `<li lily-procedure-record-list-item>` items. Props: ProcedureRecordList.md.
 */
@Component({
    selector: "lily-procedure-record-list",
    standalone: true,
    template: `<ul class="procedure-record-list {{ className() }}" [attr.data-status]="status() || null" [attr.aria-label]="label() || statusLabel() || null">@if (status() !== "known") {<li class="procedure-record-list-status">{{ statusLabel() }}</li>}<ng-content /></ul>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcedureRecordList implements OnInit {
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
            "ProcedureRecordList",
            "status",
            this.status(),
            "A procedure record list must say whether procedures are known, none known, not recorded, unavailable or omitted.",
        );
        warnMissingProp(
            "ProcedureRecordList",
            "statusLabel",
            this.statusLabel(),
            "The status needs words a person can read.",
        );
    }
}
