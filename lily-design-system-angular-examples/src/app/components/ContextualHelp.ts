import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ContextualHelp — a help button that opens a popover with explanatory content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `contextual-help` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-contextual-help",
  standalone: true,
  template: `<div class="contextual-help {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextualHelp {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
