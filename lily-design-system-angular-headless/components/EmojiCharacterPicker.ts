import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * EmojiCharacterPicker — a picker for browsing and selecting emoji characters
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `emoji-character-picker` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-emoji-character-picker",
  standalone: true,
  template: `<div class="emoji-character-picker {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmojiCharacterPicker {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
