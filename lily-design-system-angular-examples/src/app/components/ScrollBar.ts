import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ScrollBar — a custom scrollbar element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `scroll-bar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-scroll-bar",
  standalone: true,
  template: `<div class="scroll-bar {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollBar {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
