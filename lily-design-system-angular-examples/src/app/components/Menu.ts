import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Menu — a list of actions or options triggered by a button
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-menu",
  standalone: true,
  template: `<div
    class="menu {{ className() }}"
    role="menu"
    [attr.aria-label]="label() || null"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu {
  readonly label = input<string>("");
  readonly className = input<string>("");

  /** Roving focus over the `role="menuitem"` descendants (WAI-ARIA APG menu pattern). */
  protected onKeydown(event: KeyboardEvent): void {
    const root = event.currentTarget as HTMLElement;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[role='menuitem']"));
    const index = items.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[index < items.length - 1 ? index + 1 : 0]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        items[index > 0 ? index - 1 : items.length - 1]?.focus();
        break;
      case "Home":
        event.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
    }
  }
}
