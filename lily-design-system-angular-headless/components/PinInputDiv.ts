import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PinInputDiv — a series of single-digit inputs for entering a PIN or OTP code
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `pin-input-div` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-pin-input-div",
  standalone: true,
  template: `<div class="pin-input-div {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinInputDiv {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
