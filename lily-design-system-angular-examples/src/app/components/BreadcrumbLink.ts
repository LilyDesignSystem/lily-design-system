import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BreadcrumbLink — one breadcrumb link in the trail
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `breadcrumb-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-breadcrumb-link",
  standalone: true,
  template: `<a class="breadcrumb-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbLink {
  readonly href = input<string>("");
  readonly label = input<string>("");
  readonly className = input<string>("");
}
