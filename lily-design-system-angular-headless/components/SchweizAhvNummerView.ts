import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SchweizAhvNummerView — a read-only display of Switzerland's AHV-Nummer / Numéro AVS
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `schweiz-ahv-nummer-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-schweiz-ahv-nummer-view",
  standalone: true,
  template: `<span class="schweiz-ahv-nummer-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchweizAhvNummerView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
