import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ChatNav — a navigation container for chat information
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `chat-nav` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
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
