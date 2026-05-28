import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * HorizontalScroller — a horizontally scrollable content container
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `horizontal-scroller` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-horizontal-scroller",
  standalone: true,
  template: `<div class="horizontal-scroller {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalScroller {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
