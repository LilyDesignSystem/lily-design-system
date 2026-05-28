import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Menu — a list of actions or options triggered by a button
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-menu",
  standalone: true,
  template: `<div class="menu {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
