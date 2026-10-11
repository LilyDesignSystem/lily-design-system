<script setup lang="ts">

    // Listbox component
    //
    // A headless listbox that presents a list of selectable options using the ARIA
    // listbox role with full keyboard navigation. Two navigation models, chosen via
    // `navigation`:
    //
    //   "roving-focus" (default, unchanged since this component's introduction) —
    //   real DOM focus moves between child `[role="option"]` elements; arrows wrap
    //   at the ends; no typeahead, paging, or activation event.
    //
    //   "active-descendant" (added for consumers needing the full WAI-ARIA APG
    //   listbox keyboard contract, e.g. an icon-button-triggered picker) — the
    //   listbox root itself holds real focus and tracks a virtual cursor via
    //   `aria-activedescendant`, mirrored through `v-model:activeIndex` so the
    //   consumer's own option markup can render `data-active`/`aria-selected` on
    //   the option at that index. Adds `clamp` (vs. wrap), typeahead, PageUp/
    //   PageDown paging, and `activate`/`escape`/`tab-out` emits so the consumer
    //   decides what "select" / "cancel" / "leave" actually do.
    //
    // Used when users need to select one or more items from a visible list, such
    // as settings panels, filter selections, or multi-select interfaces.
    //
    // Props:
    //   className — string, optional. CSS class name (falls through via Vue's
    //     default attribute inheritance and merges with baseClass).
    //   baseClass — string, default "listbox". The base class token itself
    //     (not appended — replaces "listbox" outright). A consumer whose own
    //     contract requires an exact class sets this instead of layering `class`
    //     on top of the default.
    //   as — string, default "div". Root element tag. A consumer whose spec
    //     requires e.g. a `<ul>` root sets `as="ul"`.
    //   label — string, required. Accessible name applied via aria-label.
    //   default slot. Option elements (should have role="option" and tabindex="-1").
    //   navigation — "roving-focus" | "active-descendant", default "roving-focus".
    //   activeIndex — number, v-model:activeIndex, default -1. The virtual cursor
    //     position (active-descendant mode only); -1 means no option is active.
    //   clamp — boolean, default false. Arrow keys clamp at the ends instead of
    //     wrapping (active-descendant mode only; roving-focus always wraps).
    //   typeahead — boolean, default false. Printable characters move the cursor
    //     to the next option whose text starts with the typed buffer, cycling on a
    //     repeated character (active-descendant mode only).
    //   pageSize — number, default 10. PageUp/PageDown move the cursor by this
    //     many options, clamped (active-descendant mode only).
    //   emits activate(index) — Enter/Space on the active option (active-descendant only).
    //   emits escape() — Escape pressed (active-descendant only).
    //   emits tab-out(event) — Tab pressed, emitted BEFORE the browser processes
    //     the key (not prevented) so the consumer can move focus first — e.g. to
    //     the trigger button — before Tab's default action computes the next stop
    //     from wherever focus ends up (active-descendant only).
    //   ...restProps — additional HTML attributes spread onto the root (Vue's
    //     automatic single-root attribute fallthrough).
    //
    // Exposes (defineExpose): `el` — the rendered root element, for a consumer
    // that needs to call .focus() on it (active-descendant mode).
    //
    // Syntax:
    //   <Listbox label="Fruits">
    //     <div role="option" tabindex="-1">Apple</div>
    //   </Listbox>
    //
    // Examples:
    //   <!-- Basic listbox with static options (roving-focus, unchanged default) -->
    //   <Listbox label="Fruits">
    //     <div role="option" tabindex="-1">Apple</div>
    //     <div role="option" tabindex="-1">Banana</div>
    //   </Listbox>
    //
    //   <!-- active-descendant mode: consumer owns rendering each option's
    //        id/aria-selected/data-active from the bound activeIndex -->
    //   <Listbox
    //     label="Fruits"
    //     navigation="active-descendant"
    //     clamp
    //     v-model:activeIndex="activeIndex"
    //     @activate="(i) => choose(fruits[i])"
    //   >
    //     <div v-for="(fruit, i) in fruits" :key="fruit" role="option" :id="`fruit-${i}`"
    //       :aria-selected="i === activeIndex" :data-active="i === activeIndex ? '' : undefined">{{ fruit }}</div>
    //   </Listbox>
    //
    // Keyboard:
    //   roving-focus: ArrowDown/ArrowUp move focus and wrap; Home/End jump.
    //   active-descendant: ArrowDown/ArrowUp move the cursor (wrap unless `clamp`);
    //     Home/End jump; PageUp/PageDown move by `pageSize` (clamped); typeahead
    //     when `typeahead` is set; Enter/Space emits `activate`; Escape emits
    //     `escape`; Tab emits `tab-out` without being prevented.
    //
    // Accessibility:
    //   - role="listbox" identifies the container as a listbox widget
    //   - aria-label provides an accessible name describing the listbox purpose
    //   - roving-focus: child elements should use role="option" and optionally aria-selected
    //   - active-descendant: the root carries aria-activedescendant and tabindex="-1";
    //     the consumer's option elements carry the matching id
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - All option content comes through the default slot
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - roving-focus (default): arrow keys wrap around at boundaries, consumer
    //     handles selection state externally — unchanged from this component's
    //     original behaviour, so existing consumers of the default mode see no
    //     difference.
    //   - active-descendant: opt-in via `navigation="active-descendant"`; every
    //     new prop/emit is inert unless that mode is selected.
    //
    // References:
    //   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

    import { computed, ref } from "vue";

    const props = withDefaults(defineProps<{
        /** Accessible label. */
        label: string;
        /** Base class token, replacing "listbox" outright (not appended). */
        baseClass?: string;
        /** Root element tag. Default "div" (unchanged). */
        as?: string;
        /** Navigation/focus model. Default "roving-focus" (unchanged legacy behaviour). */
        navigation?: "roving-focus" | "active-descendant";
        /** Virtual cursor position (active-descendant mode). v-model, -1 = none. */
        activeIndex?: number;
        /** Arrow keys clamp instead of wrap (active-descendant mode). */
        clamp?: boolean;
        /** Printable-character typeahead (active-descendant mode). */
        typeahead?: boolean;
        /** PageUp/PageDown step size (active-descendant mode). */
        pageSize?: number;
    }>(), {
        baseClass: "listbox",
        as: "div",
        navigation: "roving-focus",
        activeIndex: -1,
        clamp: false,
        typeahead: false,
        pageSize: 10,
    });

    const emit = defineEmits<{
        (e: "update:activeIndex", index: number): void;
        (e: "activate", index: number): void;
        (e: "escape"): void;
        (e: "tab-out", event: KeyboardEvent): void;
    }>();

    const rootRef = ref<HTMLElement | undefined>(undefined);

    defineExpose({ el: rootRef });

    function options(): HTMLElement[] {
        return rootRef.value
            ? Array.from(rootRef.value.querySelectorAll<HTMLElement>("[role='option']"))
            : [];
    }

    // ---------------------------------------------------------------
    // roving-focus (default, unchanged): real DOM focus per option, wraps.
    // ---------------------------------------------------------------

    function onRovingFocusKeydown(event: KeyboardEvent) {
        const opts = options();
        const current = document.activeElement as HTMLElement;
        const index = opts.indexOf(current);
        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const next = index < opts.length - 1 ? index + 1 : 0;
                opts[next]?.focus();
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prev = index > 0 ? index - 1 : opts.length - 1;
                opts[prev]?.focus();
                break;
            }
            case "Home": {
                event.preventDefault();
                opts[0]?.focus();
                break;
            }
            case "End": {
                event.preventDefault();
                opts[opts.length - 1]?.focus();
                break;
            }
        }
    }

    // ---------------------------------------------------------------
    // active-descendant (opt-in): virtual cursor, clamp/wrap, typeahead, paging.
    // ---------------------------------------------------------------

    let typeaheadBuffer = "";
    let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

    function setActiveIndex(next: number): void {
        emit("update:activeIndex", next);
    }

    function moveActive(delta: number): void {
        const count = options().length;
        if (count === 0) return;
        const next = props.activeIndex + delta;
        setActiveIndex(
            props.clamp
                ? Math.min(Math.max(next, 0), count - 1)
                : ((next % count) + count) % count,
        );
    }

    function runTypeahead(char: string): void {
        const opts = options();
        if (opts.length === 0) return;
        const lower = char.toLowerCase();
        const sameCharRun = typeaheadBuffer === "" || [...typeaheadBuffer].every((c) => c === lower);
        typeaheadBuffer += lower;
        clearTimeout(typeaheadTimer);
        typeaheadTimer = setTimeout(() => (typeaheadBuffer = ""), 500);
        const query = sameCharRun ? lower : typeaheadBuffer;
        const anchor = props.activeIndex < 0 ? 0 : props.activeIndex;
        const start = sameCharRun ? anchor + 1 : anchor;
        for (let n = 0; n < opts.length; n++) {
            const i = (start + n) % opts.length;
            if ((opts[i].textContent ?? "").trim().toLowerCase().startsWith(query)) {
                setActiveIndex(i);
                return;
            }
        }
    }

    function onActiveDescendantKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                moveActive(1);
                break;
            case "ArrowUp":
                event.preventDefault();
                moveActive(-1);
                break;
            case "Home":
                event.preventDefault();
                setActiveIndex(options().length ? 0 : -1);
                break;
            case "End":
                event.preventDefault();
                setActiveIndex(options().length - 1);
                break;
            case "PageDown":
                event.preventDefault();
                moveActive(props.pageSize);
                break;
            case "PageUp":
                event.preventDefault();
                moveActive(-props.pageSize);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                if (props.activeIndex >= 0) emit("activate", props.activeIndex);
                break;
            case "Escape":
                event.preventDefault();
                emit("escape");
                break;
            case "Tab":
                // Not prevented: the consumer's tab-out handler (e.g. moving
                // focus to a trigger button) runs first via the emit, so the
                // browser's default Tab proceeds from wherever focus ends up,
                // not from this element.
                emit("tab-out", event);
                break;
            default:
                if (props.typeahead && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                    runTypeahead(event.key);
                }
        }
    }

    function onkeydown(event: KeyboardEvent): void {
        if (props.navigation === "active-descendant") onActiveDescendantKeydown(event);
        else onRovingFocusKeydown(event);
    }

    const activeId = computed(() => {
        if (props.navigation !== "active-descendant" || props.activeIndex < 0) return undefined;
        return options()[props.activeIndex]?.id || undefined;
    });

</script>

<template>
    <!-- Listbox.vue -->
    <component
        :is="as"
        ref="rootRef"
        :class="baseClass"
        role="listbox"
        :aria-label="label"
        :tabindex="navigation === 'active-descendant' ? -1 : undefined"
        :aria-activedescendant="activeId"
        @keydown="onkeydown"
    >
        <slot />
    </component>
</template>
