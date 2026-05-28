import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * PhaseBanner — a banner showing service development phase and inviting feedback
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `phase-banner` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-phase-banner",
  standalone: true,
  template: `<div class="phase-banner {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseBanner {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
