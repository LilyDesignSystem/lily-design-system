import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * ProcedureRecordListItem: one procedure in a procedure record list, with its status and when it was performed (tasks.md P28-T3, spec/healthcare-ui). Attribute selector on the native `<li>`:
 * the consumer writes `<li lily-procedure-record-list-item>`, so the host element is the list item and the list's semantics hold. Props: ProcedureRecordListItem.md.
 */
@Component({
    selector: "li[lily-procedure-record-list-item]",
    standalone: true,
    template: `@if (subjectLabel()) {<span class="procedure-record-list-item-subject">{{ subjectLabel() }}</span>{{ " " }}}<span class="procedure-record-list-item-procedure">{{ procedure() }}</span>@if (statusLabel()) {{{ " " }}<span class="procedure-record-list-item-status">{{ statusLabel() }}</span>}@if (performedLabel()) {{{ " " }}<time class="procedure-record-list-item-performed" [attr.datetime]="performed() || null">{{ performedLabel() }}</time>}<ng-content />`,
    host: {
        "[class]": '"procedure-record-list-item " + className()',
        "[attr.data-status]": "status() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcedureRecordListItem implements OnInit {
    readonly className = input<string>("");
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    readonly subjectLabel = input<string>("");
    /** the procedure; never truncated */
    readonly procedure = input<string>("");
    /** FHIR Procedure status */
    readonly status = input<
        | "preparation"
        | "in-progress"
        | "not-done"
        | "on-hold"
        | "stopped"
        | "completed"
        | "entered-in-error"
        | "unknown"
        | ""
    >("");
    readonly statusLabel = input<string>("");
    /** when it was performed, for <time datetime> */
    readonly performed = input<string>("");
    readonly performedLabel = input<string>("");

    ngOnInit(): void {
        if (this.status())
            warnMissingProp(
                "ProcedureRecordListItem",
                "statusLabel",
                this.statusLabel(),
                "a status needs words a person can read, never a code alone.",
            );
    }
}
