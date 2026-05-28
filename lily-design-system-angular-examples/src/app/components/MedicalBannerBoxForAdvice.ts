import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MedicalBannerBoxForAdvice — a medical record banner box for advice information e.g. contacts, contexts, plans, etc.
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `medical-banner-box-for-advice` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-medical-banner-box-for-advice",
  standalone: true,
  template: `<div class="medical-banner-box-for-advice {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalBannerBoxForAdvice {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
