import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Scroller — a scrollytelling container with step-based foreground and background composition
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `scroller` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-scroller",
  standalone: true,
  template: `<div class="scroller {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scroller {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
