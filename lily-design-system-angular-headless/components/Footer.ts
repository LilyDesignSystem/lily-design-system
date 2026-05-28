import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Footer — a page or section footer area
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `footer` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-footer",
  standalone: true,
  template: `<footer class="footer {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></footer>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
