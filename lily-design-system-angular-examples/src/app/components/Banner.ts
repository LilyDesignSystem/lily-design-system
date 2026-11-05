import { ChangeDetectionStrategy, Component, input, output, signal } from "@angular/core";

/**
 * Banner — a prominent message bar across the top of a page
 *
 * Headless Angular component: a polite live region. Dismissing removes it for good and emits `closed`. Ships zero CSS.
 */
@Component({
    selector: "lily-banner",
    standalone: true,
    template: `@if (visible()) {
            <div
                class="banner {{ className() }}"
                role="region"
                aria-live="polite"
                [attr.aria-label]="label() || null"
                [attr.data-type]="type()"
            >
                <ng-content />
                @if (dismissible()) {
                    <button type="button" [attr.aria-label]="closeLabel() || null" (click)="dismiss()"></button>
                }
            </div>
        }`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Banner {
    readonly label = input<string>("");
    readonly type = input<"info" | "success" | "warning" | "error">("info");
    readonly dismissible = input<boolean>(false);
    readonly closeLabel = input<string>("");
    readonly className = input<string>("");
    readonly closed = output<void>();

    protected readonly visible = signal(true);

    protected dismiss(): void {
        this.visible.set(false);
        this.closed.emit();
    }
}
