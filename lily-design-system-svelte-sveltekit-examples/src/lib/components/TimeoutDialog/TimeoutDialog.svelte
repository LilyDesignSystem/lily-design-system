<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        open = false,
        children,
        ...restProps
    }: {
        label?: string;
        open?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    // Always rendered, shown while `open`: as a real modal where the browser has one (see Dialog/modal.ts).
    let el: HTMLDialogElement | undefined = $state(undefined);
    $effect(() => {
        if (!el) return;
        if (open && !el.open) {
            if (typeof el.showModal === "function") el.showModal();
            else el.setAttribute("open", "");
        } else if (!open && el.open) {
            if (typeof el.close === "function") el.close();
            else el.removeAttribute("open");
        }
    });
</script>

<!-- TimeoutDialog.svelte -->
<dialog
    class={`timeout-dialog ${className}`}
    role="alertdialog"
    aria-label={label}
    bind:this={el}
    {...restProps}
>
    {@render children?.()}
</dialog>
