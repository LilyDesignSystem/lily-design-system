<script lang="ts">
    import { untrack } from "svelte";
    // FiveStarRatingPicker component
    //
    // A five-star rating input that lets users select a rating from 1 to 5 stars using
    // radio buttons. This is one of the most common rating patterns on the web, used for
    // product reviews, content ratings, and feedback forms. Each radio button is labeled
    // with "N star" or "N stars" for clear screen reader communication.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the rating group via aria-label.
    //   starLabel — (star: number) => string, optional. Each option's text; defaults to the number (no English).
    //   value — number, default 0. Current rating (1-5, 0 = none); bindable via bind:value.
    //   name — string, default "rating". Radio group name for form submission.
    //   disabled — boolean, default false. Whether the entire group is disabled.
    //   ...restProps — additional HTML attributes spread onto the fieldset.
    //
    // Syntax:
    //   <FiveStarRatingPicker label="Rate this" bind:value />
    //
    // Examples:
    //   <!-- Basic star rating with two-way binding -->
    //   <FiveStarRatingPicker label="Rate this product" bind:value={rating} />
    //
    //   <!-- Disabled star rating -->
    //   <FiveStarRatingPicker label="Your rating" bind:value disabled />
    //
    // Keyboard:
    //   - Tab: Focus the selected radio (or first if none selected)
    //   - ArrowDown / ArrowRight: Move to next radio button
    //   - ArrowUp / ArrowLeft: Move to previous radio button
    //   - Space: Select the focused radio button
    //
    // Accessibility:
    //   - role="radiogroup" on the fieldset identifies the group as a set of radio buttons
    //   - aria-label provides an accessible name for the entire rating group
    //   - Each radio label reads "1 star", "2 stars", etc. for screen reader clarity
    //
    // Internationalization:
    //   - The label prop allows localized accessible names
    //   - Star labels ("N star"/"N stars") are in the template; consumer can override via restProps
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses native radio buttons for built-in keyboard and accessibility behavior
    //   - Value 0 means no selection; valid ratings are 1-5
    //
    // References:
    //   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/

    let {
        class: className = "",
        label,
        value = $bindable(0),
        name = "rating",
        starLabel,
        disabled = false,
        ...restProps
    }: {
        /** Accessible name for the rating group via aria-label. */
        label: string;
        /** Current rating (1-5, 0 = none). Bindable via bind:value. */
        value?: number;
        /** Radio group name for form submission. */
        name?: string;
        /** Each option's text, e.g. (n) => `${n} stars`. Defaults to the number alone: no English default. */
        starLabel?: (star: number) => string;
        /** Whether the entire group is disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    const stars = [1, 2, 3, 4, 5];

    // Form reset: the radios use a one-way `checked`, which a reset clears
    // without telling this component, so `value` would keep a rating the form no
    // longer submits. Restore the initial value instead — one tick later, after
    // the browser has reset the DOM, and not when the reset was cancelled.
    let root: HTMLFieldSetElement | undefined = $state();
    const initialValue = untrack(() => value);
    $effect(() => {
        const form = root?.form ?? root?.closest("form");
        if (!form) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (event.defaultPrevented || !root) return;
                value = initialValue;
                for (const input of root.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
                    input.checked = input.value === String(initialValue);
                }
            }, 0);
        };
        form.addEventListener("reset", onReset);
        return () => {
            clearTimeout(timer);
            form.removeEventListener("reset", onReset);
        };
    });
</script>

<!-- FiveStarRatingPicker.svelte -->
<fieldset
    bind:this={root}
    class={`five-star-rating-picker ${className}`}
    role="radiogroup"
    aria-label={label}
    {disabled}
    {...restProps}
>
    {#each stars as star}
        <label>
            <input
                type="radio"
                {name}
                value={star}
                checked={value === star}
                onchange={() => (value = star)}
            />
            {starLabel ? starLabel(star) : star}
        </label>
    {/each}
</fieldset>
