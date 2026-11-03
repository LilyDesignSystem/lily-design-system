import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ChatNav component
 *
 * The navigation landmark around a conversation (ChatNav > ChatList > ChatListItem). Renders a <nav>
 * with the `chat-nav` hook.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The ChatList.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-chat-nav label="…">…</lily-chat-nav>
 *
 * Examples:
 *   <lily-chat-nav label="Conversation"><lily-chat-list>…</lily-chat-list></lily-chat-nav>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - The native <nav> element supplies the navigation landmark; give it a `label` so it is distinguishable from other navs
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <nav>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
 */
@Component({
    selector: "lily-chat-nav",
    standalone: true,
    template: `<nav class="chat-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatNav {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
