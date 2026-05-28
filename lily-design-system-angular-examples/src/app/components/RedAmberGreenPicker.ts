import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RedAmberGreenPicker — a picker for selecting a red/amber/green status
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `red-amber-green-picker` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-red-amber-green-picker",
  standalone: true,
  template: `<div class="red-amber-green-picker {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedAmberGreenPicker {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
