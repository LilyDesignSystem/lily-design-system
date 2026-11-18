import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * EmojiCharacterRadioInput — a radio input for one choice of an emoji character <input type="radio">
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `emoji-character-radio-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-emoji-character-radio-input",
    standalone: true,
    template: `<input
      [attr.id]="id() ?? null"
      class="emoji-character-radio-input {{ className() }}"
      type="radio"
      [attr.aria-label]="label() || null"
      autocomplete="off"
      [attr.name]="name() ?? null"
      [checked]="checked()"
      [value]="value()"
      [attr.data-value]="value() || null"
      (input)="value.set($any($event.target).value)"
      [disabled]="disabled()"
      [required]="required()"
    />`,
    host: { "[attr.id]": "null" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmojiCharacterRadioInput {
    /** Accessible label, applied to aria-label. */
    readonly label = input<string>("");
    /** The id of the inner control, so a <label for> or lily-field inputId reaches it (the host gets none). */
    readonly id = input<string | undefined>(undefined);
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** Form field name, shared by the group. */
    readonly name = input<string | undefined>(undefined);
    /** Whether this radio is the chosen one. */
    readonly checked = input<boolean>(false);
    /** Bindable input value. */
    readonly value = model<string>("");
    /** Whether the input is required for form submission. */
    readonly required = input<boolean>(false);
    /** Whether the input is disabled. */
    readonly disabled = input<boolean>(false);
}
