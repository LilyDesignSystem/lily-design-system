import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Drawer — a panel that slides in from the edge of the screen
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `drawer` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-drawer",
  standalone: true,
  template: `<div class="drawer {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
