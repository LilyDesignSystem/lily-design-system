import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ContextMenu — a menu that appears on right-click or long-press
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `context-menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-context-menu",
  standalone: true,
  template: `<div class="context-menu {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenu {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
