import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ScrollerBase — a low-level scroll position tracking primitive for scrollytelling
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `scroller-base` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-scroller-base",
  standalone: true,
  template: `<div class="scroller-base {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollerBase {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
