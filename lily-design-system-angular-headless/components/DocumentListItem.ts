import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DocumentListItem — one document entry in a document list
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `document-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-document-list-item",
  standalone: true,
  template: `<li class="document-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListItem {
  readonly className = input<string>("");
}
