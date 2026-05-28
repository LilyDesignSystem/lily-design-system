import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Expander — a control that expands to reveal more content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `expander` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-expander",
  standalone: true,
  template: `<div class="expander {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Expander {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
