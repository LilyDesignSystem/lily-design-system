import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * NederlandIdentiteitskaartNummerView — a read-only display of Netherlands's Identiteitskaart Nummer
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `nederland-identiteitskaart-nummer-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-nederland-identiteitskaart-nummer-view",
  standalone: true,
  template: `<span class="nederland-identiteitskaart-nummer-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NederlandIdentiteitskaartNummerView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
