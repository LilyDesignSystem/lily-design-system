import { effect, ElementRef, inject } from "@angular/core";

/**
 * Writes a host attribute from an input, only once that input has a value. Angular runs a host binding after the parent's
 * `[attr.x]`, so a host binding would erase what a consumer set, as `{...restProps}` after an attribute never does in Svelte.
 * The grid helpers set `[attr.tabindex]` and `[attr.aria-selected]` on these cells. Call it in a field initializer or a
 * constructor. `undefined` leaves the attribute alone, and `null` removes it.
 */
export function attrWhenSet(name: string, value: () => string | null | undefined): void {
    const element = inject(ElementRef).nativeElement as HTMLElement;
    effect(() => {
        const next = value();
        if (next === undefined) return;
        if (next === null) element.removeAttribute(name);
        else element.setAttribute(name, next);
    });
}
