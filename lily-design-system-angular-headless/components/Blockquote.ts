import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Blockquote — a block-level quotation with optional source citation
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `blockquote` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-blockquote",
  standalone: true,
  template: `<div class="blockquote {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Blockquote {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
