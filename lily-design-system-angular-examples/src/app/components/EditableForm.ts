import { ChangeDetectionStrategy, Component, input } from "@angular/core";

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
  template: `<div class="editable-form {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableForm {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
