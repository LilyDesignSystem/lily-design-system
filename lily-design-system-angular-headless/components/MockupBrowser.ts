import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MockupBrowser — a box area that looks like a web browser
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mockup-browser` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-mockup-browser",
  standalone: true,
  template: `<div class="mockup-browser {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockupBrowser {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
