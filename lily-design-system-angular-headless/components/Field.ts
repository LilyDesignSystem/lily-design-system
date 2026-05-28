import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Field — a form field wrapper with label, input, and error message
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `field` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-field",
  standalone: true,
  template: `<div class="field {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Field {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
