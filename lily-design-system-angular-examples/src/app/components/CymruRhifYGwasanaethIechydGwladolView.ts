import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CymruRhifYGwasanaethIechydGwladolView — a read-only display of Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `cymru-rhif-y-gwasanaeth-iechyd-gwladol-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view",
  standalone: true,
  template: `<span class="cymru-rhif-y-gwasanaeth-iechyd-gwladol-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CymruRhifYGwasanaethIechydGwladolView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
