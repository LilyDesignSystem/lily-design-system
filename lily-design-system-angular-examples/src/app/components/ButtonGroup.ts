import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ButtonGroup — a wrapper that groups related buttons together
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `button-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-button-group",
  standalone: true,
  template: `<div class="button-group {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
