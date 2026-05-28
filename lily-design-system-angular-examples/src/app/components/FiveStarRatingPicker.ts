import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FiveStarRatingPicker — a picker for selecting a 1-5 star rating using radio buttons
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `five-star-rating-picker` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-five-star-rating-picker",
  standalone: true,
  template: `<div class="five-star-rating-picker {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiveStarRatingPicker {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
