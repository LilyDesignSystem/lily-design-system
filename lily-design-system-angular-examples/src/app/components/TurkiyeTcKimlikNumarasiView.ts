import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TurkiyeTcKimlikNumarasiView — a read-only display of Turkey's T.C. Kimlik Numarası
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `turkiye-tc-kimlik-numarasi-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-turkiye-tc-kimlik-numarasi-view",
  standalone: true,
  template: `<span class="turkiye-tc-kimlik-numarasi-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TurkiyeTcKimlikNumarasiView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
