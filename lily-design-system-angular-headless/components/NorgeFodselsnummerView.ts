import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * NorgeFodselsnummerView — a read-only display of Norway's Fødselsnummer
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `norge-fodselsnummer-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-norge-fodselsnummer-view",
  standalone: true,
  template: `<span class="norge-fodselsnummer-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NorgeFodselsnummerView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
