import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * TimelineListItem — one event in a timeline list
 *
 * Headless Angular component. Attribute selector on the native `<li>` —
 * the consumer writes `<li lily-timeline-list-item>`, so the host element IS the
 * `<li>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `timeline-list-item` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "li[lily-timeline-list-item]",
    standalone: true,
    imports: [NgTemplateOutlet],
    template: `<ng-template #content><ng-content /></ng-template>@if (datetime() || heading()) {<time [attr.datetime]="datetime() || null">{{ heading() }}</time>}@if (entryState() === "withheld") {<span class="timeline-list-item-entry-state">{{ entryStateLabel() }}</span>} @else if (entryState() === "entered-in-error") {<del class="timeline-list-item-entry"><ng-container [ngTemplateOutlet]="content" /></del><span class="timeline-list-item-entry-state">{{ entryStateLabel() }}</span>} @else {<ng-container [ngTemplateOutlet]="content" />}`,
    host: {
        "[class]": '"timeline-list-item " + className()',
        "[attr.data-entry-state]": "entryState() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineListItem implements OnInit {
    readonly className = input<string>("");
    /** Machine-readable date. */
    readonly datetime = input<string>("");
    /** Visible date or title. */
    readonly heading = input<string>("");
    /** withheld: content not shown, only the words; entered-in-error: content kept in a <del>, with the words. data-entry-state */
    readonly entryState = input<"withheld" | "entered-in-error" | "">("");
    /** That state in the consumer's words; required with entryState. */
    readonly entryStateLabel = input<string>("");

    ngOnInit(): void {
        if (this.entryState())
            warnMissingProp(
                "TimelineListItem",
                "entryStateLabel",
                this.entryStateLabel(),
                "a withheld or in-error entry must say so in words.",
            );
    }
}
