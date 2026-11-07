import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

/**
 * TourListItem — one step in a tour guide list
 *
 * Headless Angular component. Attribute selector on the native `<li>`, so the host element IS the `<li>`. Only the current
 * step shows. The step's name is the consumer's: the Svelte component's English "(Step 1 of 3)" is not ported. Ships zero CSS.
 */
@Component({
    selector: "li[lily-tour-list-item]",
    standalone: true,
    template: `<ng-content />`,
    host: {
        "[class]": '"tour-list-item " + className()',
        "[attr.aria-label]": "fullLabel()",
        "[attr.data-current]": 'current() ? "" : null',
        "[attr.aria-hidden]": 'current() ? null : "true"',
        "[hidden]": "!current()",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourListItem {
    readonly label = input<string>("");
    readonly current = input<boolean>(false);
    readonly stepNumber = input<number | null>(null);
    readonly totalSteps = input<number | null>(null);
    /** With both numbers, replaces `label`: {label}, {step} and {total} are filled in. */
    readonly stepTemplate = input<string>("");
    readonly className = input<string>("");

    protected readonly fullLabel = computed(() => {
        const step = this.stepNumber();
        const total = this.totalSteps();
        if (!this.stepTemplate() || step === null || total === null) return this.label() || null;
        return this.stepTemplate()
            .replace("{label}", this.label())
            .replace("{step}", String(step))
            .replace("{total}", String(total));
    });
}
