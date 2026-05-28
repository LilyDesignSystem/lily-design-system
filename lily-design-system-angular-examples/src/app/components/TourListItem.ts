import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TourListItem — one step in a tour guide list
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tour-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tour-list-item",
  standalone: true,
  template: `<li class="tour-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourListItem {
  readonly className = input<string>("");
}
