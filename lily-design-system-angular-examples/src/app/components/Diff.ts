import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Diff — a side-by-side comparison of two items
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `diff` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-diff",
  standalone: true,
  template: `<div class="diff {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Diff {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
