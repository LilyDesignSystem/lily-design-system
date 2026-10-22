import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  viewChild,
} from "@angular/core";

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
  template: `@if (open()) {
    <div
      #menu
      class="context-menu {{ className() }}"
      role="menu"
      [attr.aria-label]="label() || null"
      (keydown)="onKeydown($event)"
    ><ng-content /></div>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenu {
  readonly label = input<string>("");
  /** Whether the menu is visible. Two-way bindable; Escape sets it to false. */
  readonly open = model<boolean>(false);
  readonly className = input<string>("");

  private readonly menu = viewChild<ElementRef<HTMLElement>>("menu");

  constructor() {
    const injector = inject(Injector);
    effect(() => {
      if (this.open()) {
        afterNextRender(() => this.menu()?.nativeElement.querySelector<HTMLElement>("[role='menuitem']")?.focus(), { injector });
      }
    });
  }

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
      case "Escape":
        event.preventDefault();
        this.open.set(false);
        break;
    }
  }
}
