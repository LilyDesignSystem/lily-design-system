import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, output, signal } from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * MedicalBanner — a prominent message bar across the top of a page, with medical information
 *
 * Headless Angular component: a polite live region. Dismissing removes it for good and emits `closed`. Ships zero CSS.
 */
@Component({
    selector: "lily-medical-banner",
    standalone: true,
    template: `@if (visible()) {
            <div
                class="medical-banner {{ className() }}"
                role="region"
                aria-live="polite"
                [attr.aria-label]="label() || null"
                [attr.data-type]="type()"
                data-context="medical"
            >
                <ng-content />
                @if (dismissible()) {
                    <button type="button" [attr.aria-label]="closeLabel() || null" (click)="dismiss()"></button>
                }
            </div>
        }`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalBanner implements OnInit {
    private readonly lilyHost = inject(ElementRef);

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

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "MedicalBanner",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
