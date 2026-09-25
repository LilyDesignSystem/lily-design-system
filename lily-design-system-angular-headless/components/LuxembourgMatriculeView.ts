import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * LuxembourgMatriculeView — a read-only display of Luxembourg's Numéro d'Identification Nationale (Matricule)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `luxembourg-matricule-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-luxembourg-matricule-view",
  standalone: true,
  template: `<span class="luxembourg-matricule-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LuxembourgMatriculeView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
