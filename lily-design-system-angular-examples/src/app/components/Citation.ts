import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Citation — a citation acknowledges the relevance of a work of another to the topic of discussion
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `citation` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-citation",
  standalone: true,
  template: `<div class="citation {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Citation {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
