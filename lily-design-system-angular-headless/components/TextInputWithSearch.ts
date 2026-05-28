import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TextInputWithSearch — a single-line text input field <input type="text"> with search capability
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `text-input-with-search` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-text-input-with-search",
  standalone: true,
  template: `<div class="text-input-with-search {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputWithSearch {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
