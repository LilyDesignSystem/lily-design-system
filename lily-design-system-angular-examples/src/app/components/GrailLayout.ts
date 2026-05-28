import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GrailLayout — a responsive web design structure with header, left aside, center main, right aside, footer
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `grail-layout` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-grail-layout",
  standalone: true,
  template: `<div class="grail-layout {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrailLayout {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
