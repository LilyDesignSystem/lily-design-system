import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MockupTabletPortrait — a box area that looks like a tablet computer in portrait mode
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mockup-tablet-portrait` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-mockup-tablet-portrait",
  standalone: true,
  template: `<div class="mockup-tablet-portrait {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockupTabletPortrait {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
