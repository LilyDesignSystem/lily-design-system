import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ContentsNav — a contents navigation area
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `contents-nav` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-contents-nav",
  standalone: true,
  template: `<nav class="contents-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentsNav {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
