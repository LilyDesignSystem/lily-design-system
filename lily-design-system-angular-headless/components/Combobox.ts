import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Combobox — a text input combined with a dropdown list for filtering options
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `combobox` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-combobox",
  standalone: true,
  template: `<div class="combobox {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Combobox {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
