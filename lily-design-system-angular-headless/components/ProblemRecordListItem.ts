import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * ProblemRecordListItem: one problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution (tasks.md P28-T3, spec/healthcare-ui). Attribute selector on the native `<li>`:
 * the consumer writes `<li lily-problem-record-list-item>`, so the host element is the list item and the list's semantics hold. Props: ProblemRecordListItem.md.
 */
@Component({
    selector: "li[lily-problem-record-list-item]",
    standalone: true,
    template: `<span class="problem-record-list-item-condition">{{ condition() }}</span>@if (clinicalStatusLabel()) {{{ " " }}<span class="problem-record-list-item-clinical-status">{{ clinicalStatusLabel() }}</span>}@if (verificationStatusLabel()) {{{ " " }}<span class="problem-record-list-item-verification-status">{{ verificationStatusLabel() }}</span>}@if (severityLabel()) {{{ " " }}<span class="problem-record-list-item-severity">{{ severityLabel() }}</span>}@if (onsetLabel()) {{{ " " }}<time class="problem-record-list-item-onset" [attr.datetime]="onset() || null">{{ onsetLabel() }}</time>}@if (abatementLabel()) {{{ " " }}<time class="problem-record-list-item-abatement" [attr.datetime]="abatement() || null">{{ abatementLabel() }}</time>}<ng-content />`,
    host: {
        "[class]": '"problem-record-list-item " + className()',
        "[attr.data-clinical-status]": "clinicalStatus() || null",
        "[attr.data-verification-status]": "verificationStatus() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemRecordListItem implements OnInit {
    readonly className = input<string>("");
    /** the problem or condition; never truncated */
    readonly condition = input<string>("");
    /** FHIR Condition clinicalStatus */
    readonly clinicalStatus = input<
        "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved" | ""
    >("");
    readonly clinicalStatusLabel = input<string>("");
    /** FHIR Condition verificationStatus; a refuted or entered-in-error record must never read as a confirmed one */
    readonly verificationStatus = input<
        | "unconfirmed"
        | "provisional"
        | "differential"
        | "confirmed"
        | "refuted"
        | "entered-in-error"
        | ""
    >("");
    readonly verificationStatusLabel = input<string>("");
    /** the severity in words */
    readonly severityLabel = input<string>("");
    /** when it began, for <time datetime> */
    readonly onset = input<string>("");
    readonly onsetLabel = input<string>("");
    /** when it resolved, for <time datetime> */
    readonly abatement = input<string>("");
    readonly abatementLabel = input<string>("");

    ngOnInit(): void {
        if (this.clinicalStatus())
            warnMissingProp(
                "ProblemRecordListItem",
                "clinicalStatusLabel",
                this.clinicalStatusLabel(),
                "a status needs words a person can read, never a code alone.",
            );
        if (this.verificationStatus())
            warnMissingProp(
                "ProblemRecordListItem",
                "verificationStatusLabel",
                this.verificationStatusLabel(),
                "a status needs words a person can read, never a code alone.",
            );
    }
}
