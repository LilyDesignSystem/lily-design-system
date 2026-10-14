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
  template: `<a
    class="contents-link {{ className() }}"
    [attr.href]="href() || '#'"
    [attr.aria-label]="label() || null"
    [attr.data-count]="count() ?? null"
    [attr.data-complete]="count() === 0 ? '' : null"
    ><ng-content />@if (countLabel()) {<span class="contents-link-count">{{ countLabel() }}</span>}</a
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentsLink {
  readonly href = input<string>("");
  readonly label = input<string>("");
  readonly className = input<string>("");
  /** Sets data-count on the link (and data-complete when 0). */
  readonly count = input<number | undefined>(undefined);
  /** Visible, localised count text (e.g. "3 to do"), rendered inside the link after the text. */
  readonly countLabel = input<string | undefined>(undefined);
}
