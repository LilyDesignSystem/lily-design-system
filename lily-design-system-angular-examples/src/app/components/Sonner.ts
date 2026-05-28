import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Sonner — a toast notification manager
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `sonner` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-sonner",
  standalone: true,
  template: `<div class="sonner {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sonner {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
