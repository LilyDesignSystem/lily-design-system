import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ContextMenuItem — one item in a context menu
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `context-menu-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-context-menu-item",
  standalone: true,
  template: `<div class="context-menu-item {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuItem {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
