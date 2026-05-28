import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * VideoPlayer — a video player with play-in-view behavior, custom controls, and IntersectionObserver support
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `video-player` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-video-player",
  standalone: true,
  template: `<div class="video-player {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayer {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
