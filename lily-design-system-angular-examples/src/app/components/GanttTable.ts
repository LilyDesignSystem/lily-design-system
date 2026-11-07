import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { attachGrid } from "./widget-keys";

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
    private readonly keysHost = inject(ElementRef);
    private readonly keysDestroy = inject(DestroyRef);

    ngOnInit(): void {
        warnMissingName("GanttTable", this.label());
    }

    ngAfterViewInit(): void {
        const root = this.keysHost.nativeElement.querySelector(".gantt-table");
        this.keysDestroy.onDestroy(attachGrid(root));
    }

    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Visible caption of the table. */
    readonly caption = input<string | undefined>(undefined);
}
