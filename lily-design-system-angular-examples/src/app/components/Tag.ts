import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Tag — a keyword label for categorizing content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tag` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tag",
  standalone: true,
  // Not a live region: aria-label is not allowed on a plain <span>, so the label is screen-reader text appended after the content (the themes hide .screen-reader-span). The content stays exposed: it may hold a focusable control, such as a remove button.
  template: `@if (live()) {
      <span class="tag {{ className() }}" role="status" [attr.aria-label]="label() || null"><ng-content /></span>
    } @else {
      <span class="tag {{ className() }}"><ng-content />@if (label()) {<span class="screen-reader-span">{{ label() }}</span>}</span>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tag {
  readonly label = input<string>("");
  readonly className = input<string>("");
  /** Announce changes: a role="status" live region. Off by default. */
  readonly live = input<boolean>(false);
}
