import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * Dial — a rotary dial control for selecting a value
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `dial` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-dial",
  standalone: true,
  template: `<div
    class="dial {{ className() }}"
    role="slider"
    [attr.tabindex]="disabled() ? -1 : 0"
    [attr.aria-label]="label() || null"
    [attr.aria-valuenow]="value()"
    [attr.aria-valuemin]="min()"
    [attr.aria-valuemax]="max()"
    [attr.aria-disabled]="disabled() ? 'true' : null"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dial {
  readonly label = input<string>("");
  /** Current value. Two-way bindable. */
  readonly value = model<number>(0);
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly step = input<number>(1);
  readonly disabled = input<boolean>(false);
  readonly className = input<string>("");

  private clamp(v: number): number {
    return Math.min(this.max(), Math.max(this.min(), v));
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const delta = this.step() * (event.shiftKey ? 10 : 1);
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        this.value.set(this.clamp(this.value() + delta));
        break;
      case "ArrowLeft":
      case "ArrowDown":
        this.value.set(this.clamp(this.value() - delta));
        break;
      case "Home":
        this.value.set(this.min());
        break;
      case "End":
        this.value.set(this.max());
        break;
      default:
        return;
    }
    event.preventDefault();
  }
}
