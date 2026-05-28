import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PaginationListItem — one pagination list item in the trail
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `pagination-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-pagination-list-item",
  standalone: true,
  template: `<li class="pagination-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationListItem {
  readonly className = input<string>("");
}
