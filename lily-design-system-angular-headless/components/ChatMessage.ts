import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ChatMessage component
 *
 * One message in a conversation. Renders an <article> with the `chat-message` hook; author, time and
 * body are the consumer's children.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, optional. Accessible name, rendered as aria-label on the root.
 *   <ng-content /> — projected content, required. The message content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Syntax:
 *   <lily-chat-message label="…">…</lily-chat-message>
 *
 * Examples:
 *   <lily-chat-message label="Message from Sam"><p>Hello</p></lily-chat-message>
 *
 * Keyboard:
 *   - None -- not interactive; any interactive children handle their own keys
 *
 * Accessibility:
 *   - aria-label comes from `label` when given
 *   - The native <article> element supplies the article role
 *
 * Internationalization:
 *   - No hardcoded user-facing strings
 *
 * Claude rules:
 *   - Headless: no CSS, no styles -- consumer provides all styling
 *
 * References:
 *   - MDN <article>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
 */
@Component({
    selector: "lily-chat-message",
    standalone: true,
    template: `<article class="chat-message {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></article>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessage {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
