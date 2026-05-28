import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BreadcrumbNav — a navigation container for breadcrumb trail links
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `breadcrumb-nav` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-breadcrumb-nav",
  standalone: true,
  template: `<nav class="breadcrumb-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbNav {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
