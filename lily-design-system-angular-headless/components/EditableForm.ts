import { ChangeDetectionStrategy, Component, input, model, output } from "@angular/core";

/**
 * EditableForm — a form wrapper for inline editing of content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `editable-form` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-editable-form",
  standalone: true,
  template: `@if (editing()) {
    <form
      class="editable-form {{ className() }}"
      tabindex="-1"
      [attr.aria-label]="label() || null"
      (submit)="onSubmit($event)"
      (keydown)="onKeydown($event)"
    ><ng-content /></form>
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableForm {
  readonly label = input<string>("");
  /** Whether the form is showing. Two-way bindable; submit and Escape set it to false. */
  readonly editing = model<boolean>(false);
  readonly className = input<string>("");
  /** Emitted after the form is submitted (the native submit is prevented). */
  readonly submitted = output<SubmitEvent>();
  /** Emitted when Escape cancels editing. */
  readonly cancelled = output<void>();

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.editing.set(false);
    this.submitted.emit(event as SubmitEvent);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      this.editing.set(false);
      this.cancelled.emit();
    }
  }
}
