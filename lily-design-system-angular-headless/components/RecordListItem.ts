import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * RecordListItem: one record in a record list, with its status and last update around the consumer's content (tasks.md P28-T3, spec/healthcare-ui). Attribute selector on the native `<li>`:
 * the consumer writes `<li lily-record-list-item>`, so the host element is the list item and the list's semantics hold. Props: RecordListItem.md.
 */
@Component({
    selector: "li[lily-record-list-item]",
    standalone: true,
    imports: [NgTemplateOutlet],
    template: `<ng-template #content><ng-content /></ng-template>@if (subjectLabel()) {<span class="record-list-item-subject">{{ subjectLabel() }}</span>{{ " " }}}@if (entryState() === "withheld") {<span class="record-list-item-entry-state">{{ entryStateLabel() }}</span>} @else if (entryState() === "entered-in-error") {<del class="record-list-item-entry"><ng-container [ngTemplateOutlet]="content" /></del>{{ " " }}<span class="record-list-item-entry-state">{{ entryStateLabel() }}</span>} @else {<ng-container [ngTemplateOutlet]="content" />}@if (statusLabel()) {{{ " " }}<span class="record-list-item-status">{{ statusLabel() }}</span>}@if (updatedLabel()) {{{ " " }}<time class="record-list-item-updated" [attr.datetime]="updated() || null">{{ updatedLabel() }}</time>}`,
    host: {
        "[class]": '"record-list-item " + className()',
        "[attr.data-status]": "status() || null",
        "[attr.data-entry-state]": "entryState() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordListItem implements OnInit {
    readonly className = input<string>("");
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    readonly subjectLabel = input<string>("");
    /** the record's status, as the consumer's code */
    /** withheld: content not shown, only the words; entered-in-error: content kept in a <del>, with the words. data-entry-state */
    readonly entryState = input<"withheld" | "entered-in-error" | "">("");
    /** That state in the consumer's words; required with entryState. */
    readonly entryStateLabel = input<string>("");
    readonly status = input<string>("");
    readonly statusLabel = input<string>("");
    /** when the record was last updated */
    readonly updated = input<string>("");
    readonly updatedLabel = input<string>("");

    ngOnInit(): void {
        if (this.status())
            warnMissingProp(
                "RecordListItem",
                "statusLabel",
                this.statusLabel(),
                "a status needs words a person can read, never a code alone.",
            );
        if (this.entryState())
            warnMissingProp(
                "RecordListItem",
                "entryStateLabel",
                this.entryStateLabel(),
                "a withheld or in-error entry must say so in words.",
            );
    }
}
