import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MockupShell — a box area that looks like a terminal shell
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mockup-shell` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-mockup-shell",
  standalone: true,
  template: `<div class="mockup-shell {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockupShell {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
