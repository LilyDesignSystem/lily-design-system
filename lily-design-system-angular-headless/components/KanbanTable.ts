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
 * KanbanTable — a kanban board table interactive grid for organizing items by status <table>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `kanban-table` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-kanban-table",
    standalone: true,
    template: `<table class="kanban-table {{ className() }}" role="grid" [attr.aria-label]="label() || null">@if (caption()) {<caption>{{ caption() }}</caption>}<ng-content /></table>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanTable {
    private readonly keysHost = inject(ElementRef);
    private readonly keysDestroy = inject(DestroyRef);

    ngOnInit(): void {
        warnMissingName("KanbanTable", this.label());
    }

    ngAfterViewInit(): void {
        const root = this.keysHost.nativeElement.querySelector(".kanban-table");
        this.keysDestroy.onDestroy(attachGrid(root));
    }

    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Visible caption of the table. */
    readonly caption = input<string | undefined>(undefined);
}
