import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TabBar — a group of tabs for switching between content panels
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tab-bar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tab-bar",
  standalone: true,
  template: `<div class="tab-bar {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabBar {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
