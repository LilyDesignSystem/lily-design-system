import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MedicalBanner — a prominent message bar across the top of a page, with medical information
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `medical-banner` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-medical-banner",
  standalone: true,
  template: `<div class="medical-banner {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalBanner {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
