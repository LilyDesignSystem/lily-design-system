import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Code — an inline code span for displaying short code snippets within surrounding text
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `code` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-code",
  standalone: true,
  template: `<div class="code {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Code {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
