import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MedicalBannerBox — a medical banner box that is inside a medical-banner component, using flexbox horizontal, with medical information
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `medical-banner-box` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-medical-banner-box",
  standalone: true,
  template: `<div class="medical-banner-box {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalBannerBox {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
