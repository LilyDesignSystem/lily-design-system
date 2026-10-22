import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * ToggleButton — a button that toggles between pressed and unpressed states
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `toggle-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-toggle-button",
  standalone: true,
  template: `<button
    class="toggle-button {{ className() }}"
    type="button"
    role="switch"
    [attr.aria-checked]="pressed()"
    [attr.aria-label]="label() || null"
    [disabled]="disabled()"
    (click)="toggle()"
  ><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButton {
  readonly label = input<string>("");
  /** Whether the control is on. Two-way bindable. */
  readonly pressed = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly className = input<string>("");

  /**
   * Space and Enter activate a native <button> through `click`, so no key handler is
   * needed (and none can double-toggle).
   */
  protected toggle(): void {
    if (!this.disabled()) this.pressed.set(!this.pressed());
  }
}
