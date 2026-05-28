import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ChatListItem — one chat list item component, typically containing one chat message component
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `chat-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-chat-list-item",
  standalone: true,
  template: `<li class="chat-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatListItem {
  readonly className = input<string>("");
}
