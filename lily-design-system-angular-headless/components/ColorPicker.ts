import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * ColorPicker — a two-dimensional board for picking colors by hue and saturation
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `color-picker` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-color-picker",
  standalone: true,
  template: `<div
    class="color-picker {{ className() }}"
    role="slider"
    [attr.tabindex]="disabled() ? -1 : 0"
    [attr.aria-label]="label() || null"
    [attr.aria-valuenow]="x()"
    aria-valuemin="0"
    aria-valuemax="100"
    [attr.aria-disabled]="disabled() ? 'true' : null"
    [attr.data-x]="x()"
    [attr.data-y]="y()"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPicker {
  readonly label = input<string>("");
  /** Horizontal position, 0-100 (saturation). Two-way bindable. */
  readonly x = model<number>(0);
  /** Vertical position, 0-100 (brightness). Two-way bindable. */
  readonly y = model<number>(0);
  readonly disabled = input<boolean>(false);
  readonly className = input<string>("");

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const step = event.shiftKey ? 10 : 1;
    switch (event.key) {
      case "ArrowRight":
        this.x.set(Math.min(100, this.x() + step));
        break;
      case "ArrowLeft":
        this.x.set(Math.max(0, this.x() - step));
        break;
      case "ArrowUp":
        this.y.set(Math.max(0, this.y() - step));
        break;
      case "ArrowDown":
        this.y.set(Math.min(100, this.y() + step));
        break;
      case "Home":
        this.x.set(0);
        break;
      case "End":
        this.x.set(100);
        break;
      default:
        return;
    }
    event.preventDefault();
  }
}
