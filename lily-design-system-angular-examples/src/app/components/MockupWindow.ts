import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MockupWindow — a box area that looks like a desktop window
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mockup-window` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-mockup-window",
  standalone: true,
  template: `<div class="mockup-window {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockupWindow {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
