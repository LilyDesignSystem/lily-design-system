import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Carousel — a slideshow for cycling through content items
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `carousel` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-carousel",
  standalone: true,
  template: `<div class="carousel {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carousel {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
