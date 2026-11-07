<script lang="ts">
    import { untrack } from "svelte";
    // RedAmberGreenPicker component
    //
    // A picker for a red/amber/green (RAG) status: a <fieldset role="radiogroup"> of native radios, one per status (red, amber, green), as
    // five-star-rating-picker is. The radios give the keys, form submission and form reset natively.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the group via aria-label.
    //   statusLabel — (status: string) => string, required. Each option's visible text; without it the option shows
    //     its value, so a consumer always supplies the words.
    //   value — string, default "". The checked status ("" = none); bindable via bind:value.
    //   name — string, default "status". Radio group name for form submission.
    //   disabled — boolean, default false. Whether the entire group is disabled.
    //   ...restProps — additional HTML attributes spread onto the fieldset.
    //
    // Syntax:
    //   <RedAmberGreenPicker label="Project status" statusLabel={(s) => labels[s]} bind:value />
    //
    // Keyboard (native radios):
    //   - Tab: focus the checked radio, or the first if none is checked
    //   - ArrowDown / ArrowRight: move to and check the next radio
    //   - ArrowUp / ArrowLeft: move to and check the previous radio
    //   - Space: check the focused radio
    //
    // Accessibility:
    //   - role="radiogroup" on the fieldset, named by aria-label
    //   - Each radio is named by its visible text, so status is never colour alone (WCAG 1.4.1)
    //
    // Internationalization:
    //   - No English: the label and every option's text come from the consumer
    //
    // References:
    //   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
    //   - Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system
    import { warnMissingName } from "../dev-warning";

    let {
        class: className = "",
        label,
        value = $bindable(""),
        name = "status",
        statusLabel,
        disabled = false,
        ...restProps
    }: {
        /** Accessible name for the group via aria-label. */
        label: string;
        /** The checked status ("" = none). Bindable via bind:value. */
        value?: string;
        /** Radio group name for form submission. */
        name?: string;
        /** Each option's visible text, e.g. (status) => labels[status]. No English default. */
        statusLabel: (status: string) => string;
        /** Whether the entire group is disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "RedAmberGreenPicker",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    const statuses = ["red", "amber", "green"];

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
                for (const input of root.querySelectorAll<HTMLInputElement>(
                    'input[type="radio"]',
                )) {
                    input.checked = input.value === initialValue;
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

<!-- RedAmberGreenPicker.svelte -->
<fieldset
    bind:this={root}
    class={`red-amber-green-picker ${className}`}
    role="radiogroup"
    aria-label={label}
    {disabled}
    {...restProps}
>
    {#each statuses as status}
        <label>
            <input
                type="radio"
                {name}
                value={status}
                checked={value === status}
                onchange={() => (value = status)}
            />
            {statusLabel ? statusLabel(status) : status}
        </label>
    {/each}
</fieldset>
