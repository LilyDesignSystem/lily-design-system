import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ArticleLayout — a top-level article wrapper that sets CSS custom properties for content column widths
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `article-layout` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-article-layout",
  standalone: true,
  template: `<div class="article-layout {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleLayout {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
