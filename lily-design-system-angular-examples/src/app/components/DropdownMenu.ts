import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DropdownMenu — a menu that opens below a trigger button
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `dropdown-menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-dropdown-menu",
  standalone: true,
  template: `<div class="dropdown-menu {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenu {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
