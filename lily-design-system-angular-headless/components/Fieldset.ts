import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Fieldset — a group of related form fields with a legend
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `fieldset` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-fieldset",
  standalone: true,
  template: `<fieldset class="fieldset {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></fieldset>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Fieldset {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
