import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PaginationLink — one pagination link in the trail
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `pagination-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-pagination-link",
  standalone: true,
  template: `<a class="pagination-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationLink {
  readonly href = input<string>("");
  readonly label = input<string>("");
  readonly className = input<string>("");
}
