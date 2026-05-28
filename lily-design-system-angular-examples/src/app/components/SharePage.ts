import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SharePage — a component for sharing the page on social media
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `share-page` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-share-page",
  standalone: true,
  template: `<div class="share-page {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharePage {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
