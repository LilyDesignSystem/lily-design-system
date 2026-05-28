import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PolskaNumerIdentyfikacjiPodatkowejView — a read-only display of Poland's Numer Identyfikacji Podatkowej (NIP)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `polska-numer-identyfikacji-podatkowej-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-polska-numer-identyfikacji-podatkowej-view",
  standalone: true,
  template: `<span class="polska-numer-identyfikacji-podatkowej-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolskaNumerIdentyfikacjiPodatkowejView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
