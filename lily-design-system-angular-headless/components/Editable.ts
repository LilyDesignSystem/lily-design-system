import { ChangeDetectionStrategy, Component, input, model, signal } from "@angular/core";

/**
 * Editable — an inline-editable text element that toggles between view and edit modes
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `editable` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-editable",
  standalone: true,
  template: `@if (editing()) {
    <input
      class="editable {{ className() }}"
      type="text"
      [attr.aria-label]="label() || null"
      [value]="draft()"
      (input)="draft.set($any($event.target).value)"
      (keydown)="onInputKeydown($event)"
    />
  } @else {
    <span
      class="editable {{ className() }}"
      role="button"
      [attr.tabindex]="disabled() ? -1 : 0"
      [attr.aria-label]="value() ? value() + ', ' + label() : label() || null"
      [attr.aria-disabled]="disabled() ? 'true' : null"
      (click)="startEditing()"
      (keydown)="onDisplayKeydown($event)"
    >{{ value() }}</span>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Editable {
  readonly label = input<string>("");
  /** The committed value. Two-way bindable. */
  readonly value = model<string>("");
  /** Whether the text field is showing. Two-way bindable. */
  readonly editing = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly className = input<string>("");

  protected readonly draft = signal("");

  protected startEditing(): void {
    if (this.disabled()) return;
    this.draft.set(this.value());
    this.editing.set(true);
  }

  protected onDisplayKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.startEditing();
    }
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
      this.value.set(this.draft());
      this.editing.set(false);
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.draft.set(this.value());
      this.editing.set(false);
    }
  }
}
