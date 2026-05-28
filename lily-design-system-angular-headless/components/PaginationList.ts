import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PaginationList — an ordered list of pagination list items
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `pagination-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-pagination-list",
  standalone: true,
  template: `<ol class="pagination-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
