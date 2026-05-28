import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DocumentList — a list displaying documents with titles and metadata
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `document-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-document-list",
  standalone: true,
  template: `<ol class="document-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
