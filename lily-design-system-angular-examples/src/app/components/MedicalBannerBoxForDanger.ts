import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MedicalBannerBoxForDanger — a medical record banner box for danger information e.g. reactions, warnings, alarms, etc.
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `medical-banner-box-for-danger` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-medical-banner-box-for-danger",
  standalone: true,
  template: `<div class="medical-banner-box-for-danger {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalBannerBoxForDanger {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
