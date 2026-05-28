import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * CeskoCestovniPasInput — an input for entering Czech Republic's Cestovní pas
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `cesko-cestovni-pas-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-cesko-cestovni-pas-input",
  standalone: true,
  template: `<input
      class="cesko-cestovni-pas-input {{ className() }}"
      type="text"
      [attr.aria-label]="label() || null"
      autocomplete="off"
      [value]="value()"
      (input)="value.set(($event.target as HTMLInputElement).value)"
      [disabled]="disabled()"
      [required]="required()"
    />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CeskoCestovniPasInput {
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
