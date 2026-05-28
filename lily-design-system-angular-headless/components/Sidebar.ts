import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Sidebar — a side panel for navigation or supplementary content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `sidebar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-sidebar",
  standalone: true,
  template: `<div class="sidebar {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
