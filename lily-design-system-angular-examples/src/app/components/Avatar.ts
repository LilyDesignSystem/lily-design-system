import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Avatar — an avatar indicator that shows an avatar image or avatar text
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `avatar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-avatar",
  standalone: true,
  template: `<div class="avatar {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
