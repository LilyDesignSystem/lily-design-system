import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Dial — a rotary dial control for selecting a value
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `dial` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-dial",
  standalone: true,
  template: `<div class="dial {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dial {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
