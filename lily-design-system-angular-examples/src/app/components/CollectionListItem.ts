import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CollectionListItem — one item in a collection list with optional image, heading, meta, and description
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `collection-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-collection-list-item",
  standalone: true,
  template: `<li class="collection-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionListItem {
  readonly className = input<string>("");
}
