import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MockupLaptop — a box area that looks like a laptop computer
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mockup-laptop` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-mockup-laptop",
  standalone: true,
  template: `<div class="mockup-laptop {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockupLaptop {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
