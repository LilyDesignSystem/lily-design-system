import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * LatvijaPersonasKodsView — a read-only display of Latvia's Personas kods
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `latvija-personas-kods-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-latvija-personas-kods-view",
  standalone: true,
  template: `<span class="latvija-personas-kods-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatvijaPersonasKodsView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
