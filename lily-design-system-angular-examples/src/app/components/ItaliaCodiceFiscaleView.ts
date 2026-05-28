import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ItaliaCodiceFiscaleView — a read-only display of Italy's Codice fiscale (CF)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `italia-codice-fiscale-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-italia-codice-fiscale-view",
  standalone: true,
  template: `<span class="italia-codice-fiscale-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItaliaCodiceFiscaleView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
