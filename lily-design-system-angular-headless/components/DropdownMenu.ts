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
 * DropdownMenu — a menu that opens below a trigger button
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `dropdown-menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-dropdown-menu",
  standalone: true,
  template: `<div class="dropdown-menu {{ className() }}">
    <button
      type="button"
      aria-haspopup="true"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="label() || null"
      (click)="open.set(!open())"
    >{{ label() }}</button>
    @if (open()) {
      <div
        #menu
        role="menu"
        [attr.aria-label]="label() || null"
        (keydown)="onKeydown($event)"
      ><ng-content /></div>
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenu {
  readonly label = input<string>("");
  /** Whether the menu is open. Two-way bindable; Escape sets it to false. */
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
