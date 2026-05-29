import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * SuomiHenkilotunnusInput — an input for entering Finland's Henkilötunnus (HETU)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `suomi-henkilotunnus-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-suomi-henkilotunnus-input",
  standalone: true,
  template: `<input
      class="suomi-henkilotunnus-input {{ className() }}"
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
export class SuomiHenkilotunnusInput {
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
