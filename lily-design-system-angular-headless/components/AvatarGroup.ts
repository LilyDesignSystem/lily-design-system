import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AvatarGroup — a group of avatar components
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `avatar-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-avatar-group",
  standalone: true,
  template: `<div class="avatar-group {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarGroup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
