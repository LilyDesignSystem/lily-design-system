import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ContentsLink — one table of contents link
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `contents-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-contents-link",
  standalone: true,
  template: `<a class="contents-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentsLink {
  readonly href = input<string>("");
  readonly label = input<string>("");
  readonly className = input<string>("");
}
