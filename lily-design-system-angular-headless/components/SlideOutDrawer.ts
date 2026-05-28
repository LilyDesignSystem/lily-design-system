import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SlideOutDrawer — a drawer that slides out from the side of the page
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `slide-out-drawer` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-slide-out-drawer",
  standalone: true,
  template: `<div class="slide-out-drawer {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideOutDrawer {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
