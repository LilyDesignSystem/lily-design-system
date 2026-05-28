import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AiLabel — an indicator of AI instances that is a pathway to AI explainability
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `ai-label` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-ai-label",
  standalone: true,
  template: `<div class="ai-label {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiLabel {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
