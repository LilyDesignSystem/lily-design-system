import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * TurkiyeTcKimlikNumarasiInput — an input for entering Turkey's T.C. Kimlik Numarası
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `turkiye-tc-kimlik-numarasi-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-turkiye-tc-kimlik-numarasi-input",
  standalone: true,
  template: `<input
      class="turkiye-tc-kimlik-numarasi-input {{ className() }}"
      type="text"
      [attr.aria-label]="label() || null"
      autocomplete="off"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
      [disabled]="disabled()"
      [required]="required()"
    />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TurkiyeTcKimlikNumarasiInput {
  /** Accessible label, applied to aria-label. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** Bindable input value. */
  readonly value = model<string>("");
  /** Whether the input is required for form submission. */
  readonly required = input<boolean>(false);
  /** Whether the input is disabled. */
  readonly disabled = input<boolean>(false);
}
