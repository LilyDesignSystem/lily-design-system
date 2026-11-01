import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * TourList — an ordered list of tour guide steps
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tour-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 *
 * A plain `<ol>` of steps (tasks.md P18-T6): no `role="dialog"` (it hid the list semantics) and no
 * `aria-modal`; any dialog semantics belong to the enclosing non-modal Tour.
 */
@Component({
    selector: "lily-tour-list",
    standalone: true,
    template: `@if (active()) {
    <ol
      class="tour-list {{ className() }}"
      tabindex="-1"
      [attr.aria-label]="label() || null"
      (keydown)="onKeydown($event)"
    ><ng-content /></ol>
  }`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourList {
    readonly label = input<string>("");
    /** Whether the tour is showing. Two-way bindable; Escape sets it to false. */
    readonly active = model<boolean>(false);
    readonly className = input<string>("");

    protected onKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") this.active.set(false);
    }
}
