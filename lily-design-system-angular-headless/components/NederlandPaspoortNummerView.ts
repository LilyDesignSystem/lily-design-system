import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * NederlandPaspoortNummerView — a read-only display of Netherlands's Paspoort Nummer
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `nederland-paspoort-nummer-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-nederland-paspoort-nummer-view",
  standalone: true,
  template: `<span class="nederland-paspoort-nummer-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NederlandPaspoortNummerView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
