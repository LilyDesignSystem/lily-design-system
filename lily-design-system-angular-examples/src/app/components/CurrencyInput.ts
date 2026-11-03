import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { restoreOnFormReset } from "./form-reset";

/**
 * CurrencyInput component
 *
 * A currency input rendered as a native <input type="text" inputmode="decimal">.
 * The component does not format the displayed value; formatting
 * (Intl.NumberFormat, separators, currency symbol placement) is the consumer's
 * responsibility. currencyCode is exposed as data-currency-code so the
 * consumer can pass it to Intl.NumberFormat. It is REQUIRED and never
 * defaulted: the component does not pick a currency.
 *
 * Props:
 *   class        — string, optional. CSS class name.
 *   label        — string, required. Accessible name via aria-label.
 *   value        — number | undefined, bindable. Parsed numeric value.
 *   currencyCode — string, required, no default. ISO 4217 currency code.
 *   min, max     — number, optional. Constraints, not enforced clamping.
 *   required, disabled — boolean, default false.
 *   ...host-element attributes — spread onto the <input>.
 *
 * Claude rules:
 *   - Headless: no CSS, no styles; no locale formatting baked in
 *   - Never default currencyCode (AGENTS/internationalization.md)
 */
@Component({
    selector: "lily-currency-input",
    standalone: true,
    template: `<input
      class="currency-input {{ className() }}"
      type="text"
      [attr.aria-label]="label() || null"
      [attr.data-currency-code]="currencyCode()"
      autocomplete="off"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
      [disabled]="disabled()"
      [required]="required()"
    />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyInput {
    /** Accessible label, applied to aria-label. */
    readonly label = input<string>("");
    /** ISO 4217 currency code. Required; never defaulted. */
    readonly currencyCode = input.required<string>();
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** Bindable input value. */
    readonly value = model<string>("");
    /** Whether the input is required for form submission. */
    readonly required = input<boolean>(false);
    /** Whether the input is disabled. */
    readonly disabled = input<boolean>(false);

    constructor() {
        restoreOnFormReset(this.value);
    }
}
