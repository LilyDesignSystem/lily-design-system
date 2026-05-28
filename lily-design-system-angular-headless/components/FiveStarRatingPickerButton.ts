import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FiveStarRatingPickerButton — a picker button for selecting a 1-5 star rating using radio buttons
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `five-star-rating-picker-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-five-star-rating-picker-button",
  standalone: true,
  template: `<button class="five-star-rating-picker-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiveStarRatingPickerButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
