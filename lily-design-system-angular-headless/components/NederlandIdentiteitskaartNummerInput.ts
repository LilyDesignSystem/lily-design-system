import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * NederlandIdentiteitskaartNummerInput — an input for entering Netherlands's Identiteitskaart Nummer
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `nederland-identiteitskaart-nummer-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-nederland-identiteitskaart-nummer-input",
  standalone: true,
  template: `<input
      class="nederland-identiteitskaart-nummer-input {{ className() }}"
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
export class NederlandIdentiteitskaartNummerInput {
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
