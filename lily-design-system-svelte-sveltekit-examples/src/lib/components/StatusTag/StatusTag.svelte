<script lang="ts">
    // StatusTag component
    //
    // A short status label. Renders a <span role="status"> with the `status-tag` hook; `type` is exposed
    // as data-type for the consumer's CSS (colours are not set here).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   type — "default" | "info" | "success" | "warning" | "error", default "default". Rendered as data-type.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <span>.
    //
    // Syntax:
    //   <StatusTag type="success">…</StatusTag>
    //
    // Examples:
    //   <StatusTag type="warning">Pending</StatusTag>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - role="status" is a polite live region: a tag whose text changes after load is announced
    //   - Meaning must come from the text, not the colour (WCAG 1.4.1)
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - `type` is a styling hook, not an ARIA state
    //
    // References:
    //   - WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        type = "default",
        children,
        ...restProps
    }: {
        label?: string;
        type?: "default" | "info" | "success" | "warning" | "error";
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- StatusTag.svelte -->
<span
    class={`status-tag ${className}`}
    role="status"
    aria-label={label}
    data-type={type}
    {...restProps}
>
    {@render children?.()}
</span>
