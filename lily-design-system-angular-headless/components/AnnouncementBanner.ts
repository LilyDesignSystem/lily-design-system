import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AnnouncementBanner — a banner highlighting important messages for all users
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `announcement-banner` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-announcement-banner",
  standalone: true,
  template: `<div class="announcement-banner {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementBanner {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
