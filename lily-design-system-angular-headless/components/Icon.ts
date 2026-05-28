import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Icon — a container for displaying an icon
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `icon` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-icon",
  standalone: true,
  template: `<div class="icon {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
