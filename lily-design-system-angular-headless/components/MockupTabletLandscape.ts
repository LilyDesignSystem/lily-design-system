import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MockupTabletLandscape — a box area that looks like a tablet computer in landscape mode
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mockup-tablet-landscape` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-mockup-tablet-landscape",
  standalone: true,
  template: `<div class="mockup-tablet-landscape {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockupTabletLandscape {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
