import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CollectionListItem — one item in a collection list with optional image, heading, meta, and description
 *
 * Headless Angular component. Attribute selector on the native `<li>` —
 * the consumer writes `<li lily-collection-list-item>`, so the host element IS the
 * `<li>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `collection-list-item` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "li[lily-collection-list-item]",
    standalone: true,
    template: `@if (imageUrl()) {<img class="collection-list-item-image" [attr.src]="imageUrl()" [attr.alt]="imageAlt()" />}
        <h3 class="collection-list-item-heading">@if (href()) {<a [attr.href]="href()">{{ heading() }}</a>} @else {{{ heading() }}}</h3>
        @if (meta()) {<p class="collection-list-item-meta">{{ meta() }}</p>}
        @if (description()) {<p class="collection-list-item-description">{{ description() }}</p>}
        <ng-content />`,
    host: {
        "[class]": '"collection-list-item " + className()',
        "[attr.aria-label]": "label() || null",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionListItem {
    readonly className = input<string>("");
    /** Accessible name. */
    readonly label = input<string>("");
    /** Item title. */
    readonly heading = input<string>("");
    /** Line of metadata. */
    readonly meta = input<string | undefined>(undefined);
    /** Summary. */
    readonly description = input<string | undefined>(undefined);
    /** Image address. */
    readonly imageUrl = input<string | undefined>(undefined);
    /** Text alternative of the image. */
    readonly imageAlt = input<string>("");
    /** Makes the title a link. */
    readonly href = input<string | undefined>(undefined);
}
