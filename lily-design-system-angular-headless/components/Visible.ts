import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    model,
    viewChild,
} from "@angular/core";

/**
 * Visible — an IntersectionObserver wrapper that exposes element visibility state
 *
 * Headless Angular component: data-visible and `[(visible)]` say whether it is on screen. Ships zero CSS.
 */
@Component({
    selector: "lily-visible",
    standalone: true,
    template: `<div #root class="visible {{ className() }}" [attr.data-visible]="visible()"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Visible {
    /** Whether it is on screen; read it with `[(visible)]`. */
    readonly visible = model<boolean>(false);
    /** Stop watching the first time it is seen. */
    readonly once = input<boolean>(false);
    readonly threshold = input<number>(0);
    readonly rootMargin = input<string>("0px");
    readonly className = input<string>("");

    private readonly root = viewChild.required<ElementRef<HTMLElement>>("root");

    constructor() {
        const destroyRef = inject(DestroyRef);
        afterNextRender(() => {
            if (typeof IntersectionObserver === "undefined") return;
            const observer = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        this.visible.set(entry.isIntersecting);
                        if (this.once() && entry.isIntersecting) observer.disconnect();
                    }
                },
                { threshold: this.threshold(), rootMargin: this.rootMargin() },
            );
            observer.observe(this.root().nativeElement);
            destroyRef.onDestroy(() => observer.disconnect());
        });
    }
}
