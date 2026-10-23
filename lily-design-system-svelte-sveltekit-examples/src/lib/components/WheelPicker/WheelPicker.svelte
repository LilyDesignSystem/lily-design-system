<script lang="ts">
    // WheelPicker component
    //
    // A vertical single-select listbox where the selection follows the cursor: moving with the arrow keys, typing, or
    // clicking an option chooses it. Use it to pick one of a short list (hours, minutes, months, years) in the manner of a
    // scroll wheel. The component owns the roles, the keys and the selected value; the wheel LOOK (scroll snapping, fading,
    // 3-D) is the consumer's CSS. Pointer dragging and touch inertia are plain scrolling of `.wheel-picker-list`.
    //
    // Props:
    //   class — string, optional. Consumer class appended after the base class.
    //   label — string, required. Accessible name of the listbox.
    //   options — { value: string; label: string; disabled?: boolean }[], required.
    //   value — string, bindable, default "". The selected option's value; "" or an unknown value selects nothing.
    //   loop — boolean, default false. Arrow keys wrap from the last enabled option to the first and back.
    //   pageSize — number, default 5. Enabled options PageUp / PageDown move by.
    //   disabled — boolean, default false. Ignores keys and clicks; not focusable.
    //   name — string, optional. When set, a hidden input carries the value for a form.
    //   onChange — (value: string) => void, optional. Called once when the selection changes.
    //   ...restProps — spread onto the root <div>.
    //
    // Markup:
    //   <div class="wheel-picker">
    //     <div class="wheel-picker-list" role="listbox" aria-orientation="vertical" tabindex="0" aria-activedescendant>
    //       <div class="wheel-picker-option" role="option" aria-selected aria-disabled? data-value>…</div>
    //     </div>
    //     <input type="hidden" name value>   (only with `name`)
    //   </div>
    //
    // Keyboard (APG listbox, selection follows focus): ArrowDown / ArrowUp, Home / End, PageDown / PageUp, type-ahead over
    // the labels. Disabled options are skipped.
    //
    // Claude rules:
    //   - Headless: no CSS, no inline styles; no animation (the selected option is centred instantly).
    //   - No hardcoded user-facing strings.

    import {
        isWheelTypeaheadKey,
        nextWheelIndex,
        nextWheelPrefix,
        WHEEL_MOVE_KEYS,
        wheelTypeaheadIndex,
        type WheelMoveKey,
        type WheelOption,
        type WheelTypeahead,
    } from "./wheel-picker";

    let {
        class: className = "",
        label,
        options,
        value = $bindable(""),
        loop = false,
        pageSize = 5,
        disabled = false,
        name,
        onChange,
        ...restProps
    }: {
        /** Accessible name. */
        label: string;
        /** The choices. */
        options: WheelOption[];
        /** The selected option's value. Bindable. */
        value?: string;
        /** Arrow keys wrap at the ends. */
        loop?: boolean;
        /** Enabled options PageUp / PageDown move by. */
        pageSize?: number;
        /** Ignores keys and clicks. */
        disabled?: boolean;
        /** Form field name for a hidden input. */
        name?: string;
        /** Called once when the selection changes. */
        onChange?: (value: string) => void;
        [key: string]: unknown;
    } = $props();

    const uid = $props.id();
    let list: HTMLElement | undefined = $state();
    let typeahead: WheelTypeahead = { prefix: "", at: 0 };

    const selectedIndex = $derived(options.findIndex((o) => o.value === value));

    function select(index: number): void {
        if (index < 0) return;
        const next = options[index].value;
        if (next === value) return; // applying the selection already held is a no-op
        value = next;
        onChange?.(next);
    }

    function onkeydown(event: KeyboardEvent): void {
        if (disabled) return;
        if (WHEEL_MOVE_KEYS.includes(event.key)) {
            event.preventDefault();
            select(nextWheelIndex(options, selectedIndex, event.key as WheelMoveKey, { loop, pageSize }));
        } else if (isWheelTypeaheadKey(event)) {
            typeahead = nextWheelPrefix(typeahead, event.key, Date.now());
            select(wheelTypeaheadIndex(options, selectedIndex, typeahead.prefix));
        }
    }

    function onclick(event: MouseEvent): void {
        if (disabled) return;
        const target = (event.target as Element).closest<HTMLElement>('[role="option"]');
        if (!target || target.getAttribute("aria-disabled") === "true") return;
        select(Number(target.getAttribute("data-index")));
        list?.focus();
    }

    // Keep the selected option centred in the list. Only the list scrolls (never the page), and instantly: no animation.
    $effect(() => {
        const index = selectedIndex;
        if (!list || index < 0) return;
        const option = list.querySelector<HTMLElement>(`[data-index="${index}"]`);
        if (!option) return;
        list.scrollTop = option.offsetTop - (list.clientHeight - option.offsetHeight) / 2;
    });
</script>

<!-- WheelPicker.svelte -->
<div class={`wheel-picker ${className}`} {...restProps}>
    <div
        bind:this={list}
        class="wheel-picker-list"
        role="listbox"
        aria-label={label}
        aria-orientation="vertical"
        aria-disabled={disabled ? "true" : undefined}
        aria-activedescendant={selectedIndex >= 0 ? `${uid}-option-${selectedIndex}` : undefined}
        tabindex={disabled ? -1 : 0}
        {onkeydown}
        {onclick}
    >
        {#each options as option, index (option.value)}
            <div
                class="wheel-picker-option"
                role="option"
                id={`${uid}-option-${index}`}
                aria-selected={index === selectedIndex}
                aria-disabled={option.disabled ? "true" : undefined}
                data-value={option.value}
                data-index={index}
            >{option.label}</div>
        {/each}
    </div>
    {#if name}
        <input type="hidden" {name} {value} />
    {/if}
</div>
