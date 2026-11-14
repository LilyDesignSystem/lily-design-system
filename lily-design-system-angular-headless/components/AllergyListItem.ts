import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AllergyListItem: one allergy or intolerance in an AllergyList (spec/healthcare-ui item 2). Attribute selector on the
 * native `<li>` — the consumer writes `<li lily-allergy-list-item>`, so the host element is the list item and the list's
 * semantics hold. Props: AllergyListItem.md.
 */
@Component({
    selector: "li[lily-allergy-list-item]",
    standalone: true,
    template: `<span class="allergy-list-item-substance">{{ substance() }}</span>@if (reaction()) {{{ " " }}<span class="allergy-list-item-reaction">{{ reaction() }}</span>}@if (severityLabel()) {{{ " " }}<span class="allergy-list-item-severity">{{ severityLabel() }}</span>}@if (updatedLabel()) {{{ " " }}<time class="allergy-list-item-updated" [attr.datetime]="updated() || null">{{ updatedLabel() }}</time>}<ng-content />`,
    host: {
        "[class]": '"allergy-list-item " + className()',
        "[attr.data-severity]": "severity() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllergyListItem {
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
