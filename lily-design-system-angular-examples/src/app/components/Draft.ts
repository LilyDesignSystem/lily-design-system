import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Draft — a draft is a preliminary version of content that is not yet final, often with an in-progress or under-review status.
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `draft` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook. The optional
 * `status` input is reflected as a `data-status` attribute so consumer
 * CSS or JS can observe the draft's state.
 */
@Component({
  selector: "lily-draft",
  standalone: true,
  template: `<div class="draft {{ className() }}" [attr.aria-label]="label() || null" [attr.data-status]="status() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Draft {
  readonly label = input<string>("");
  readonly status = input<string>("");
  readonly className = input<string>("");
}
