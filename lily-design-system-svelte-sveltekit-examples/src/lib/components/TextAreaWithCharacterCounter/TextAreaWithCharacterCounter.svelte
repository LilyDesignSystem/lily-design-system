<script lang="ts">
    // TextAreaWithCharacterCounter component
    //
    // A headless component that wraps a native <textarea> and a character counter
    // caption inside a <div>. The counter displays "[number] of [maximum] characters"
    // below the textarea and updates reactively as the user types. Useful for
    // feedback forms, comment fields, bio inputs, and any interface with a character limit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the textarea via aria-label.
    //   value — string, default "". Bindable textarea value.
    //   maxLength — number, required. Maximum number of characters allowed.
    //   counterTemplate — string, default "{count} of {max} characters". Counter text template.
    //   rows — number, optional. Number of visible text rows.
    //   placeholder — string, optional. Placeholder text for the textarea.
    //   required — boolean, default false. Whether the textarea is required.
    //   disabled — boolean, default false. Whether the textarea is disabled.
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Syntax:
    //   <TextAreaWithCharacterCounter label="Feedback" maxLength={500} bind:value />
    //
    // Keyboard:
    //   - Tab: Focus the textarea (native browser behavior)
    //   - Standard textarea keyboard interactions
    //
    // Accessibility:
    //   - aria-label on the textarea provides accessible name
    //   - aria-describedby links textarea to the counter
    //   - aria-live="polite" on counter announces updates to screen readers
    //
    // Internationalization:
    //   - counterTemplate prop allows full customization of counter text
    //   - {count} and {max} placeholders are replaced with actual values
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - restProps spread onto the wrapper <div>, not the textarea
    //
    // References:
    //   - MDN textarea: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea

    let {
        class: className = "",
        label,
        value = $bindable(""),
        maxLength,
        counterTemplate = "{count} of {max} characters",
        rows = undefined,
        placeholder = undefined,
        required = false,
        disabled = false,
        ...restProps
    }: {
        label: string;
        value?: string;
        maxLength: number;
        counterTemplate?: string;
        rows?: number;
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    const counterId = `counter-${Math.random().toString(36).slice(2, 9)}`;

    let counterText = $derived(
        counterTemplate.replace("{count}", String(value.length)).replace("{max}", String(maxLength))
    );
</script>

<!-- TextAreaWithCharacterCounter.svelte -->
<div
    class={`text-area-with-character-counter ${className}`}
    {...restProps}
>
    <textarea
        aria-label={label}
        aria-describedby={counterId}
        bind:value
        maxlength={maxLength}
        {rows}
        {placeholder}
        {required}
        {disabled}
    ></textarea>
    <span
        id={counterId}
        aria-live="polite"
    >
        {counterText}
    </span>
</div>
