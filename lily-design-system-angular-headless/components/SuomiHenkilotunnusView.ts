import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SuomiHenkilotunnusView — a read-only display of Finland's Henkilötunnus (HETU)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `suomi-henkilotunnus-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-suomi-henkilotunnus-view",
  standalone: true,
  template: `<span class="suomi-henkilotunnus-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuomiHenkilotunnusView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
