import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";

/**
 * StickyPromoBanner — a fixed-position promotional banner with a dismiss button
 *
 * Headless Angular component, fixed to the viewport by an inline style, which is structural. The dismiss button is always
 * rendered: unlike Svelte, Angular cannot ask whether `dismissed` has a listener. Ships zero CSS.
 */
@Component({
    selector: "lily-sticky-promo-banner",
    standalone: true,
    template: `<aside
        class="sticky-promo-banner {{ className() }}"
        role="complementary"
        [attr.aria-label]="label() || null"
        [attr.data-position]="position()"
        [hidden]="!open()"
        [attr.style]="stickyStyle()"
    >
        <div class="sticky-promo-banner-content"><ng-content /></div>
        <button
            type="button"
            class="sticky-promo-banner-dismiss"
            [attr.aria-label]="dismissLabel()"
            (click)="dismissed.emit($event)"
        >
            ×
        </button>
    </aside>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyPromoBanner {
    readonly label = input.required<string>();
    readonly open = input<boolean>(true);
    readonly position = input<"top" | "bottom">("bottom");
    readonly dismissLabel = input.required<string>();
    readonly className = input<string>("");
    readonly dismissed = output<MouseEvent>();

    protected readonly stickyStyle = computed(
        () => `position: fixed; left: 0; right: 0; ${this.position() === "top" ? "top" : "bottom"}: 0;`,
    );
}
