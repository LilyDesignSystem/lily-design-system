import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ContentsList — an contents ordered list of contents list item components
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `contents-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-contents-list",
  standalone: true,
  template: `<ol class="contents-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentsList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
