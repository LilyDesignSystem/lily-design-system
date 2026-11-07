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
 * DataTable — a data table interactive grid for displaying and sorting tabular data <table>
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `data-table` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-data-table",
    standalone: true,
    template: `<table class="data-table {{ className() }}" role="grid" [attr.aria-label]="label() || null">@if (caption()) {<caption>{{ caption() }}</caption>}<ng-content /></table>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable {
    private readonly keysHost = inject(ElementRef);
    private readonly keysDestroy = inject(DestroyRef);

    ngOnInit(): void {
        warnMissingName("DataTable", this.label());
    }

    ngAfterViewInit(): void {
        const root = this.keysHost.nativeElement.querySelector(".data-table");
        this.keysDestroy.onDestroy(attachGrid(root));
    }

    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Visible caption of the table. */
    readonly caption = input<string | undefined>(undefined);
}
