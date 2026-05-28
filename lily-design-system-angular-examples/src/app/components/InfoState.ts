import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * InfoState — a composition of illustration, title, description, and action for empty, error, or info states
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `info-state` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-info-state",
  standalone: true,
  template: `<div class="info-state {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoState {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
