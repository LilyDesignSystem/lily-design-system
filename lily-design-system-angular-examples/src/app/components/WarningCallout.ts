import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * WarningCallout — a callout box highlighting a warning message
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `warning-callout` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-warning-callout",
  standalone: true,
  template: `<div class="warning-callout {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarningCallout {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
