import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MenuBar — a horizontal bar of menu triggers
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `menu-bar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-menu-bar",
  standalone: true,
  template: `<div
    class="menu-bar {{ className() }}"
    role="menubar"
    [attr.aria-label]="label() || null"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBar {
  readonly label = input<string>("");
  readonly className = input<string>("");

  /** Roving focus left/right over the `role="menuitem"` descendants. */
  protected onKeydown(event: KeyboardEvent): void {
    const root = event.currentTarget as HTMLElement;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[role='menuitem']"));
    const index = items.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        items[index < items.length - 1 ? index + 1 : 0]?.focus();
        break;
      case "ArrowLeft":
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
