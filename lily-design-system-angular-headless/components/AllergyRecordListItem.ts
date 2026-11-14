import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AllergyRecordListItem: one allergy or intolerance in an AllergyRecordList (spec/healthcare-ui item 2). Attribute selector on the
 * native `<li>` — the consumer writes `<li lily-allergy-record-list-item>`, so the host element is the list item and the list's
 * semantics hold. Props: AllergyRecordListItem.md.
 */
@Component({
    selector: "li[lily-allergy-record-list-item]",
    standalone: true,
    template: `<span class="allergy-record-list-item-substance">{{ substance() }}</span>@if (reaction()) {{{ " " }}<span class="allergy-record-list-item-reaction">{{ reaction() }}</span>}@if (severityLabel()) {{{ " " }}<span class="allergy-record-list-item-severity">{{ severityLabel() }}</span>}@if (updatedLabel()) {{{ " " }}<time class="allergy-record-list-item-updated" [attr.datetime]="updated() || null">{{ updatedLabel() }}</time>}<ng-content />`,
    host: {
        "[class]": '"allergy-record-list-item " + className()',
        "[attr.data-severity]": "severity() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllergyRecordListItem {
    readonly className = input<string>("");
    /** What the patient reacts to. Never truncated. */
    readonly substance = input<string>("");
    readonly reaction = input<string>("");
    /** FHIR AllergyIntolerance reaction severity, rendered as data-severity. */
    readonly severity = input<"mild" | "moderate" | "severe" | "">("");
    readonly severityLabel = input<string>("");
    /** When the record was last updated, for <time datetime>. */
    readonly updated = input<string>("");
    readonly updatedLabel = input<string>("");
}
