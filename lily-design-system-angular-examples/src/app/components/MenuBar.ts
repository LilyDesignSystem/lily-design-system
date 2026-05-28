import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MenuBar — a horizontal bar of menu triggers
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `menu-bar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-menu-bar",
  standalone: true,
  template: `<div class="menu-bar {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBar {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
