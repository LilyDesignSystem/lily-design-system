import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FiveFaceRatingPicker — a picker for selecting a 1-5 satisfaction rating using face labels
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `five-face-rating-picker` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-five-face-rating-picker",
  standalone: true,
  template: `<div class="five-face-rating-picker {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiveFaceRatingPicker {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
