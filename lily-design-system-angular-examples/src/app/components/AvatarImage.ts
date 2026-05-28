import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AvatarImage — an avatar indicator inside image such as a user photo
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `avatar-image` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-avatar-image",
  standalone: true,
  template: `<div class="avatar-image {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarImage {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
