import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RadioGroup — a group of radio buttons for selecting one option
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `radio-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-radio-group",
  standalone: true,
  template: `<div class="radio-group {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
