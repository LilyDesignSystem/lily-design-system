import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * RelatedContent — a section providing links to related or supporting information
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `related-content` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-related-content",
  standalone: true,
  template: `<div class="related-content {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedContent {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
