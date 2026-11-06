import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SummaryListItem — one key-value pair in a summary list
 *
 * Headless Angular component. Attribute selector on the native `<div>` —
 * the consumer writes `<div lily-summary-list-item>`, so the host element IS the
 * `<div>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `summary-list-item` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "div[lily-summary-list-item]",
    standalone: true,
    template: `<dt>{{ term() }}</dt><dd><ng-content /></dd>`,
    host: {
        "[class]": '"summary-list-item " + className()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryListItem {
    readonly className = input<string>("");
    /** The key, rendered in the dt. */
    readonly term = input<string>("");
}
