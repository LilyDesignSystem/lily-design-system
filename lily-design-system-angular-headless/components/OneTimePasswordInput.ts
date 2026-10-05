import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * OneTimePasswordInput — a single one-time-password input with a numeric keypad, SMS autofill, and a fixed length
 *
 * Headless Angular component. ONE real native `<input>` (not segmented boxes
 * like PinInputDiv) so SMS / password-manager autofill and paste work.
 * Renders the kebab-case class hook `one-time-password-input` plus the
 * consumer-provided `className`. Ships zero CSS.
 *
 * Inputs: `label` (required, aria-label), `length` (required, maxlength and
 * data-length — no default), `value` (model), `inputMode` (default "numeric"),
 * `pattern` (default "[0-9]*"), `name`, `required`, `disabled`.
 *
 * Deviation from the Svelte canonical: Angular has no rest-props spread, so
 * arbitrary attributes set on `<lily-one-time-password-input>` land on the
 * host element, not on the inner `<input>`; use the named inputs instead.
 */
@Component({
  selector: "lily-one-time-password-input",
  standalone: true,
  template: `<input
    class="one-time-password-input {{ className() }}"
    type="text"
    [attr.inputmode]="inputMode()"
    autocomplete="one-time-code"
    [attr.maxlength]="length()"
    [attr.pattern]="pattern()"
    [attr.spellcheck]="'false'"
    autocapitalize="off"
    [attr.aria-label]="label()"
    [attr.data-length]="length()"
    [attr.name]="name() ?? null"
    [value]="value()"
    (input)="value.set($any($event.target).value)"
    [required]="required()"
    [disabled]="disabled()"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OneTimePasswordInput {
  /** Accessible label, applied to aria-label. */
  readonly label = input.required<string>();
  /** Number of characters in the code (maxlength). No default. */
  readonly length = input.required<number>();
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** Bindable code value. */
  readonly value = model<string>("");
  /** Soft keyboard hint; use "text" for alphanumeric codes. */
  readonly inputMode = input<string>("numeric");
  /** Validation pattern; use e.g. "[A-Za-z0-9]*" for alphanumeric codes. */
  readonly pattern = input<string>("[0-9]*");
  /** Form field name. */
  readonly name = input<string | undefined>(undefined);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
}
