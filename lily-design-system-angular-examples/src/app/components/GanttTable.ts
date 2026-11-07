import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GanttTable — a Gantt chart table interactive grid for planning schedule visualization <table>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `gantt-table` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-gantt-table",
    standalone: true,
    template: `<table class="gantt-table {{ className() }}" role="grid" [attr.aria-label]="label() || null">@if (caption()) {<caption>{{ caption() }}</caption>}<ng-content /></table>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttTable {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Visible caption of the table. */
    readonly caption = input<string | undefined>(undefined);
}
