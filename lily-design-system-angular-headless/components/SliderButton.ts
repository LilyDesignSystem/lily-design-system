import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SliderButton — a button with a slider that the user needs to slide to confirm
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `slider-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-slider-button",
  standalone: true,
  template: `<button class="slider-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
