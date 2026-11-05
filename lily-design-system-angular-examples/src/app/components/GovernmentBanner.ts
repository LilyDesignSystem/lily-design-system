import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

let nextId = 0;

/**
 * GovernmentBanner — a banner identifying a website as belonging to a government, with an expandable details panel
 *
 * Headless Angular component: a headline, and a toggle for the details panel. `[(expanded)]` is two-way. Ships zero CSS.
 */
@Component({
    selector: "lily-government-banner",
    standalone: true,
    template: `<aside class="government-banner {{ className() }}" [attr.aria-label]="label() || null">
        <header class="government-banner-header">
            <span class="government-banner-headline">{{ headerText() }}</span>
            <button
                type="button"
                class="government-banner-toggle"
                [attr.aria-expanded]="expanded()"
                [attr.aria-controls]="panelId() || generatedId"
                (click)="expanded.set(!expanded())"
            >
                {{ expandLabel() }}
            </button>
        </header>
        <div class="government-banner-details" [attr.id]="panelId() || generatedId" [hidden]="!expanded()">
            <ng-content />
        </div>
    </aside>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovernmentBanner {
    readonly label = input.required<string>();
    readonly headerText = input.required<string>();
    readonly expandLabel = input.required<string>();
    readonly expanded = model<boolean>(false);
    readonly panelId = input<string>("");
    readonly className = input<string>("");

    protected readonly generatedId = `government-banner-panel-${++nextId}`;
}
