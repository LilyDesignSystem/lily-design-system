import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ChatMessage — a chat message shows one chat conversation message entry and all its data, including the author avatar, author name, time, etc.
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `chat-message` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-chat-message",
  standalone: true,
  template: `<div class="chat-message {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessage {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
