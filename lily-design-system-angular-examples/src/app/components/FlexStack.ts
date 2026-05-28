import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FlexStack — a flex layout container for vertical or horizontal stacking with consistent gap
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `flex-stack` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-flex-stack",
  standalone: true,
  template: `<div class="flex-stack {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexStack {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
