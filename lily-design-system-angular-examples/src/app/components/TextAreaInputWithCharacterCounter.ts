import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TextAreaInputWithCharacterCounter — a multi-line text area input with a caption below that is a character counter "[number] of [maximum] characters"
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `text-area-input-with-character-counter` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-text-area-input-with-character-counter",
  standalone: true,
  template: `<div class="text-area-input-with-character-counter {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaInputWithCharacterCounter {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
