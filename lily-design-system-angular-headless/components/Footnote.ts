import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Footnote — a footnote reference and content element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `footnote` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-footnote",
  standalone: true,
  template: `<div class="footnote {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footnote {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
