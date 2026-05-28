import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CodeBlock — a block of formatted code with optional line numbers and line highlighting
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `code-block` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-code-block",
  standalone: true,
  template: `<div class="code-block {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlock {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
