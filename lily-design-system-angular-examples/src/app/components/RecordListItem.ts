import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * RecordListItem: one record in a record list, with its status and last update around the consumer's content (tasks.md P28-T3, spec/healthcare-ui). Attribute selector on the native `<li>`:
 * the consumer writes `<li lily-record-list-item>`, so the host element is the list item and the list's semantics hold. Props: RecordListItem.md.
 */
@Component({
    selector: "li[lily-record-list-item]",
    standalone: true,
    template: `<ng-content />@if (statusLabel()) {{{ " " }}<span class="record-list-item-status">{{ statusLabel() }}</span>}@if (updatedLabel()) {{{ " " }}<time class="record-list-item-updated" [attr.datetime]="updated() || null">{{ updatedLabel() }}</time>}`,
    host: {
        "[class]": '"record-list-item " + className()',
        "[attr.data-status]": "status() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordListItem implements OnInit {
    readonly className = input<string>("");
    /** the record's status, as the consumer's code */
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
    }
}
