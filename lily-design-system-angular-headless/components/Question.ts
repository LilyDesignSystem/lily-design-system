import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Question — a question is anything that asks for information, invites a response, tests knowledge, etc.
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `question` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-question",
  standalone: true,
  template: `<div class="question {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Question {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
