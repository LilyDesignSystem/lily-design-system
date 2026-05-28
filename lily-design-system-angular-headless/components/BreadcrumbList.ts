import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BreadcrumbList — an ordered list of breadcrumb list items
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `breadcrumb-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-breadcrumb-list",
  standalone: true,
  template: `<ol class="breadcrumb-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
