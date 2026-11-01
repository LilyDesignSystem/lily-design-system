import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    computed,
    input,
    model,
    output,
} from "@angular/core";
import { initialListboxState, listboxKeydown } from "./listbox-machine";

/** Navigation/focus model. Default `"roving-focus"`: real focus moves between the options (inert before 2026-10-29, when the shared machine gave it the roving keys). */
export type ListboxNavigation = "roving-focus" | "active-descendant";

/**
 * Listbox — a list of selectable options with keyboard navigation
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `listbox` (or `baseClass`) and the consumer-
 * provided `className`. Ships zero CSS; the consumer styles via the class
 * hook.
 *
 * `navigation="active-descendant"` (opt-in; default `"roving-focus"` is
 * unchanged) implements the full WAI-ARIA APG listbox keyboard contract
 * via a virtual cursor: the root itself holds focus and tracks
 * `activeIndex` (a two-way `model()`, this catalog's established
 * bindable-state idiom — see `picker-bar`'s own contract note), mirrored
 * to `aria-activedescendant`. `clamp` (vs. wrap), `typeahead`, `pageSize`
 * paging, and `activate`/`escape`/`tabOut` outputs let a composing
 * consumer (e.g. a `*-picker` component) decide what "select" / "cancel"
 * / "leave" mean, the same division of responsibility as the Svelte
 * version this was ported from.
 *
 * Like `IconButton`, the `lily-listbox` selector tag itself is
 * `display: contents` unconditionally — a semantics-free structural
 * wrapper around the real `role="listbox"` element, so composing it
 * inside another component's template inserts no extra layout box. See
 * `IconButton`'s doc comment for the full `display: contents` reasoning
 * (mirrors the `ThemeProvider` precedent in spec/headless/index.md).
 */
@Component({
    selector: "lily-listbox",
    standalone: true,
    template: `<div
    #root
    [id]="elementId() || null"
    class="{{ baseClass() }} {{ className() }}"
    role="listbox"
    [attr.aria-label]="label() || null"
    [attr.tabindex]="navigation() === 'active-descendant' ? -1 : null"
    [attr.aria-activedescendant]="activeId()"
    [attr.hidden]="hidden() ? '' : null"
    (keydown)="onKeydown($event)"
  ><ng-content /></div>`,
    host: { style: "display: contents" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Listbox {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Base class token, replacing `"listbox"` outright (not appended). */
    readonly baseClass = input<string>("listbox");
    /** `id` for the real inner `role="listbox"` element — named `elementId`, not `id`, because the host tag's own native `id` attribute (set directly on `<lily-listbox id="...">` by a consumer) is a separate, unrelated thing once `display: contents` puts a real wrapper element between the host and the inner listbox. Needed so a composing consumer's `aria-controls`/`document.getElementById` can reach the real element. */
    readonly elementId = input<string>("");
    /** Sets `hidden` on the real inner element. Angular has no generic spread-onto-inputs mechanism (see `IconButton`'s doc comment), so this is a named input rather than a rest-prop spread. */
    readonly hidden = input<boolean>(false);
    readonly navigation = input<ListboxNavigation>("roving-focus");
    /** Arrow keys clamp instead of wrap (active-descendant mode only). */
    readonly clamp = input<boolean>(false);
    /** Printable-character typeahead (active-descendant mode only). */
    readonly typeahead = input<boolean>(false);
    /** PageUp/PageDown step size (active-descendant mode only). */
    readonly pageSize = input<number>(10);
    /** Virtual cursor position. Two-way bindable via `[(activeIndex)]`. -1 = none. */
    readonly activeIndex = model<number>(-1);
    /** Enter/Space on the active option (active-descendant mode only). */
    readonly activate = output<number>();
    /** Escape pressed (active-descendant mode only). */
    readonly escape = output<void>();
    /** Tab pressed, emitted before the key is processed — never prevented, so the consumer can move focus first (e.g. to a trigger button) before the browser's default Tab computes its target (active-descendant mode only). */
    readonly tabOut = output<KeyboardEvent>();

    @ViewChild("root") private rootRef?: ElementRef<HTMLElement>;

    // Every keyboard decision lives in the framework-free machine (shared/listbox-machine.ts, copied here by
    // bin/sync-shared-modules); this component only reads the DOM and applies the transition it returns.
    private typeaheadState = initialListboxState().typeahead;

    private options(): HTMLElement[] {
        return this.rootRef
            ? Array.from(
                  this.rootRef.nativeElement.querySelectorAll<HTMLElement>("[role='option']"),
              )
            : [];
    }

    protected readonly activeId = computed<string | null>(() => {
        if (this.navigation() !== "active-descendant") return null;
        const i = this.activeIndex();
        if (i < 0) return null;
        return this.options()[i]?.id || null;
    });

    /** Focus the root (active-descendant mode: the listbox itself holds focus). */
    focus(options?: FocusOptions): void {
        this.rootRef?.nativeElement.focus(options);
    }

    protected onKeydown(event: KeyboardEvent): void {
        const opts = this.options();
        const t = listboxKeydown(
            { activeIndex: this.activeIndex(), typeahead: this.typeaheadState },
            event,
            {
                labels: opts.map((option) => (option.textContent ?? "").trim()),
                focusedIndex: opts.indexOf(document.activeElement as HTMLElement),
                now: Date.now(),
            },
            {
                navigation: this.navigation(),
                clamp: this.clamp(),
                typeahead: this.typeahead(),
                pageSize: this.pageSize(),
            },
        );
        this.typeaheadState = t.state.typeahead;
        if (t.preventDefault) event.preventDefault();
        if (t.focus !== undefined) opts[t.focus]?.focus();
        if (t.setActiveIndex !== undefined) this.activeIndex.set(t.setActiveIndex);
        if (t.activate !== undefined) this.activate.emit(t.activate);
        if (t.escape) this.escape.emit();
        if (t.tabOut) this.tabOut.emit(event); // never prevented: Tab proceeds from wherever the consumer leaves focus
    }
}
