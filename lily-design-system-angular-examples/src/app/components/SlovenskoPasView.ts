import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SlovenskoPasView — a read-only display of Slovakia's Pas
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `slovensko-pas-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-slovensko-pas-view",
  standalone: true,
  template: `<span class="slovensko-pas-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlovenskoPasView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
