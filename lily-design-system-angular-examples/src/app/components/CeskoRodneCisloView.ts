import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CeskoRodneCisloView — a read-only display of Czech Republic's Rodné číslo (RČ)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `cesko-rodne-cislo-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-cesko-rodne-cislo-view",
  standalone: true,
  template: `<span class="cesko-rodne-cislo-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CeskoRodneCisloView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
