import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * EspanaTarjetaSanitariaIndividualInput — an input for entering an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `espana-tarjeta-sanitaria-individual-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-espana-tarjeta-sanitaria-individual-input",
  standalone: true,
  template: `<input
      class="espana-tarjeta-sanitaria-individual-input {{ className() }}"
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
export class EspanaTarjetaSanitariaIndividualInput {
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
