import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GovernmentBanner — a banner identifying a website as belonging to a government, with an expandable details panel
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `government-banner` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-government-banner",
  standalone: true,
  template: `<div class="government-banner {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovernmentBanner {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
