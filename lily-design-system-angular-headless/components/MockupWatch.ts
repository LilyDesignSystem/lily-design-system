import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MockupWatch — a box area that looks like a smart watch
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mockup-watch` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-mockup-watch",
  standalone: true,
  template: `<div class="mockup-watch {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockupWatch {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
