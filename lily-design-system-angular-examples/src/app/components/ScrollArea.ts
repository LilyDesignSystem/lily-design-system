import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ScrollArea — a scrollable container with custom scrollbar support
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `scroll-area` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-scroll-area",
  standalone: true,
  template: `<div class="scroll-area {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollArea {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
