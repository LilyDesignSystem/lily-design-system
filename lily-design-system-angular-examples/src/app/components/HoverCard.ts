import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * HoverCard — a card that appears on hover over a trigger element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `hover-card` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-hover-card",
  standalone: true,
  template: `<div class="hover-card {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoverCard {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
