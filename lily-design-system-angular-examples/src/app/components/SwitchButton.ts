import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * SwitchButton — a toggle switch for turning a setting on or off
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `switch-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-switch-button",
  standalone: true,
  template: `<button
    class="switch-button {{ className() }}"
    type="button"
    role="switch"
    [attr.aria-checked]="checked()"
    [attr.aria-label]="label() || null"
    [disabled]="disabled()"
    (click)="toggle()"
  ><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchButton {
  readonly label = input<string>("");
  /** Whether the control is on. Two-way bindable. */
  readonly checked = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly className = input<string>("");

  /**
   * Space and Enter activate a native <button> through `click`, so no key handler is
   * needed (and none can double-toggle).
   */
  protected toggle(): void {
    if (!this.disabled()) this.checked.set(!this.checked());
  }
}
