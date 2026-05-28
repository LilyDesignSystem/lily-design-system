import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DescriptionListItem — one key-value pair in a description list using dt and dd elements
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `description-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-description-list-item",
  standalone: true,
  template: `<li class="description-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionListItem {
  readonly className = input<string>("");
}
