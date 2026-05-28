import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Autosuggest — a text input that proposes matching options as users type
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `autosuggest` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-autosuggest",
  standalone: true,
  template: `<div class="autosuggest {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Autosuggest {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
