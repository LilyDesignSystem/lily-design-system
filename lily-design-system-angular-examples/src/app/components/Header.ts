import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Header — a page or section header area
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `header` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-header",
  standalone: true,
  template: `<header class="header {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></header>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
