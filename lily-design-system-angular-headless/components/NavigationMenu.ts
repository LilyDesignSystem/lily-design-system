import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * NavigationMenu — a site-wide navigation menu with links
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `navigation-menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-navigation-menu",
  standalone: true,
  template: `<div class="navigation-menu {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationMenu {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
