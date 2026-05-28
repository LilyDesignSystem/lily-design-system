import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AvatarText — an avatar indicator inner text such as a user name
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `avatar-text` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-avatar-text",
  standalone: true,
  template: `<div class="avatar-text {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarText {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
