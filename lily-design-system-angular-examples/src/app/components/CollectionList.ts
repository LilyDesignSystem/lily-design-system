import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CollectionList — a compact list of multiple related items such as articles or events
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `collection-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-collection-list",
  standalone: true,
  template: `<ol class="collection-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
