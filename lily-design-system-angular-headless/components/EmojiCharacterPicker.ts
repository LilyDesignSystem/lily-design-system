import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * EmojiCharacterPicker component
 *
 * A group of selectable emoji characters for browsing and selecting emoji.
 * Renders a <div> with role="group" and an accessible label. Commonly used
 * in messaging apps, social media, comment systems, and rich text editors.
 * The consumer provides the emoji buttons, selection logic, and category navigation.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. Accessible name describing the picker.
 *   <ng-content /> — projected content, required. The emoji buttons, one per character.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-emoji-character-picker label="Choose an emoji">
 *     <button type="button">😀</button>
 *   </lily-emoji-character-picker>
 *
 * Examples:
 *   <!-- Emoji picker with row of characters -->
 *   <lily-emoji-character-picker label="Choose an emoji">
 *     <button type="button">😀</button>
 *     <button type="button">😂</button>
 *     <button type="button">😍</button>
 *   </lily-emoji-character-picker>
 *
 * Keyboard:
 *   - Tab moves between the emoji buttons; Enter or Space chooses one (native buttons)
 *
 * Accessibility:
 *   - role="group" groups the emoji buttons under the picker's name
 *   - aria-label provides an accessible name for the picker
 *   - Give an emoji button an aria-label where the character alone is not clear
 *
 * Internationalization:
 *   - The label prop accepts any string; consumers provide localized text
 *   - Emoji characters are locale-independent
 *
 * Claude rules:
 *   - Headless: no CSS, no styles — consumer provides all styling
 *   - No internal state — purely a structural wrapper
 *   - Consumer implements selection behavior and category filtering
 *
 * References:
 *   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
 */
@Component({
    selector: "lily-emoji-character-picker",
    standalone: true,
    template: `<div class="emoji-character-picker {{ className() }}" role="group" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmojiCharacterPicker {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
