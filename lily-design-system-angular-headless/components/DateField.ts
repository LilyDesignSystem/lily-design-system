import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DateField — a structured field for entering date components
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `date-field` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-date-field",
  standalone: true,
  template: `<div class="date-field {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateField {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
