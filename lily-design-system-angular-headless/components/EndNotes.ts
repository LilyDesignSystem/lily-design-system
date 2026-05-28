import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * EndNotes — a section of titled endnote items at the end of an article
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `end-notes` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-end-notes",
  standalone: true,
  template: `<div class="end-notes {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndNotes {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
