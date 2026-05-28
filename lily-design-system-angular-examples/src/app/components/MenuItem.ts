import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MenuItem — one item in a menu
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `menu-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-menu-item",
  standalone: true,
  template: `<div class="menu-item {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItem {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
