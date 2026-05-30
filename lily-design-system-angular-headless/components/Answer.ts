import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Answer — an answer is anything that responds to a question, request, action, etc.
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `answer` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-answer",
  standalone: true,
  template: `<div class="answer {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Answer {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
