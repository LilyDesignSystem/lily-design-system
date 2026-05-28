import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * StatusLight — a small colored dot status indicator paired with a status label
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `status-light` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-status-light",
  standalone: true,
  template: `<div class="status-light {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusLight {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
