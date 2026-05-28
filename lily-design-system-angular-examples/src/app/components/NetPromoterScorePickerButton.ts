import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * NetPromoterScorePickerButton — a picker button for selecting a 0-10 Net Promoter Score
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `net-promoter-score-picker-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-net-promoter-score-picker-button",
  standalone: true,
  template: `<button class="net-promoter-score-picker-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetPromoterScorePickerButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
