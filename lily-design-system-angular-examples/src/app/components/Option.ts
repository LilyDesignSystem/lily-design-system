import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Option — an option element within a select dropdown
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `option` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-option",
  standalone: true,
  template: `<option class="option {{ className() }}" [value]="value()"><ng-content /></option>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Option {
  readonly value = input<string>("");
  readonly className = input<string>("");
}
