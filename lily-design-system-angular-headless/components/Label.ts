import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Label — a label associated with a form input
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `label` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-label",
  standalone: true,
  template: `<div class="label {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Label {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
