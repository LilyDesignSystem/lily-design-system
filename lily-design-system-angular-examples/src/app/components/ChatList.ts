import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ChatList component
 *
 * The ordered list of messages inside a ChatNav. Renders an <ol> with the `chat-list` hook; messages
 * are in chronological order, oldest first.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The ChatListItem children.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-chat-list label="…">…</lily-chat-list>
 *
 * Examples:
 *   <lily-chat-nav label="Conversation"><lily-chat-list label="Messages"><li[lily-chat-list-item]>…</li[lily-chat-list-item]></lily-chat-list></lily-chat-nav>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <ol>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
 */
@Component({
    selector: "lily-chat-list",
    standalone: true,
    template: `<ol class="chat-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatList {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
