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
  template: `<div
    class="tab-bar {{ className() }}"
    role="tablist"
    [attr.aria-label]="label() || null"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabBar {
  readonly label = input<string>("");
  readonly className = input<string>("");

  /** Roving focus over the `role="tab"` descendants (left/right, wrapping; Home/End). */
  protected onKeydown(event: KeyboardEvent): void {
    const root = event.currentTarget as HTMLElement;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[role='tab']"));
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
