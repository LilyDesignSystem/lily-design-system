import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * Select — a dropdown select element for choosing one option
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `select` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-select",
  standalone: true,
  template: `<select class="select {{ className() }}" [attr.aria-label]="label() || null" [value]="value()" (change)="value.set(($event.target as HTMLSelectElement).value)"><ng-content /></select>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select {
  readonly label = input<string>("");
  readonly className = input<string>("");
  readonly value = model<string>("");
}
