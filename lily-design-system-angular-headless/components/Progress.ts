import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Progress — a horizontal progress bar showing completion
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `progress` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-progress",
  standalone: true,
  template: `<progress class="progress {{ className() }}" [attr.aria-label]="label() || null" [value]="value()" [max]="max()"></progress>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Progress {
  readonly label = input<string>("");
  readonly value = input<number>(0);
  readonly max = input<number>(100);
  readonly className = input<string>("");
}
