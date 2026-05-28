import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PaginationNav — an ordered list of page navigation links
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `pagination-nav` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-pagination-nav",
  standalone: true,
  template: `<nav class="pagination-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationNav {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
