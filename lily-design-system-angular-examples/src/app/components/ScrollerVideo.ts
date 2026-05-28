import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ScrollerVideo — a video-driven scrollytelling component with frame-by-frame scrubbing
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `scroller-video` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-scroller-video",
  standalone: true,
  template: `<div class="scroller-video {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollerVideo {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
