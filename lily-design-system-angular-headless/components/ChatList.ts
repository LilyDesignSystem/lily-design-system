import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ChatList — an ordered list of chat list item components
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `chat-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
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
