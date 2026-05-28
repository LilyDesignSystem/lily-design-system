import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Listbox — a list of selectable options with keyboard navigation
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `listbox` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-listbox",
  standalone: true,
  template: `<div class="listbox {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Listbox {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
