import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RossiyaSnilsView — a read-only display of Russia's СНИЛС (Individual Insurance Account Number)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `rossiya-snils-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-rossiya-snils-view",
  standalone: true,
  template: `<span class="rossiya-snils-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RossiyaSnilsView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
