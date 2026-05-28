import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MenuGroup — a labeled section of menu items within a menu
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `menu-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-menu-group",
  standalone: true,
  template: `<div class="menu-group {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuGroup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
