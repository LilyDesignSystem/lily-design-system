import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RomaniaCodNumericPersonalView — a read-only display of Romania's Cod Numeric Personal (CNP)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `romania-cod-numeric-personal-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-romania-cod-numeric-personal-view",
  standalone: true,
  template: `<span class="romania-cod-numeric-personal-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RomaniaCodNumericPersonalView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
