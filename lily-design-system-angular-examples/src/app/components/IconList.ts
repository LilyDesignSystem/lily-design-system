import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * IconList — an ordered list of icon list item components
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `icon-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-icon-list",
  standalone: true,
  template: `<ol class="icon-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
