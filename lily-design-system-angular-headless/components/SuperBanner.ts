import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SuperBanner — a super-banner communicates a high-priority state that affects an entire app, experience, process, or system
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `super-banner` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-super-banner",
  standalone: true,
  template: `<div class="super-banner {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperBanner {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
