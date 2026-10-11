<script setup lang="ts">

    // FileTree component
    //
    // A headless WAI-ARIA APG tree for file/folder hierarchies. The consumer
    // supplies <li role="treeitem" aria-expanded? aria-selected?> descendants
    // (nested <ul role="group"> for folders). The root owns keyboard handling
    // over the visible [role=treeitem] items with a ROVING TABINDEX (exactly
    // one item has tabindex="0").
    //
    // Props:
    //   label -- string, required. Accessible name via aria-label.
    //   default slot -- tree items.
    //   ...attrs -- fall through onto the root <ul>.
    //
    // Keyboard:
    //   ArrowDown / ArrowUp -- next / previous visible item (clamped, no wrap)
    //   ArrowRight -- closed folder opens; open folder moves to first child
    //   ArrowLeft -- open folder closes; otherwise moves to the parent
    //   Home / End -- first / last visible item
    //   * -- expand all closed siblings at the focused level
    //   printable characters -- typeahead on the item's own text
    //   Enter / Space -- activate (click) the focused item
    //
    // Open/close is by toggling aria-expanded; consumer CSS hides the group of
    // a closed folder.

    import { onBeforeUnmount, onMounted, ref } from "vue";

    defineProps<{
        /** Accessible label. */
        label: string;
    }>();

    const treeRef = ref<HTMLElement | undefined>(undefined);

    let buffer = "";
    let bufferTimer: ReturnType<typeof setTimeout> | undefined;

    function allItems(): HTMLElement[] {
        return treeRef.value ? Array.from(treeRef.value.querySelectorAll<HTMLElement>("[role='treeitem']")) : [];
    }

    function parentItem(item: HTMLElement): HTMLElement | null {
        return item.parentElement?.closest<HTMLElement>("[role='treeitem']") ?? null;
    }

    function isVisible(item: HTMLElement): boolean {
        let p = parentItem(item);
        while (p) {
            if (p.getAttribute("aria-expanded") === "false") return false;
            p = parentItem(p);
        }
        return true;
    }

    function visibleItems(): HTMLElement[] {
        return allItems().filter(isVisible);
    }

    // The item's own text, excluding any nested group.
    function ownText(item: HTMLElement): string {
        let text = "";
        item.childNodes.forEach((n) => {
            if (n.nodeType === Node.ELEMENT_NODE && (n as HTMLElement).getAttribute("role") === "group") return;
            text += n.textContent ?? "";
        });
        return text.trim().toLowerCase();
    }

    function setStop(target: HTMLElement | undefined) {
        for (const item of allItems()) {
            item.setAttribute("tabindex", item === target ? "0" : "-1");
        }
    }

    // Keep exactly one tab stop, on a visible item.
    function normalise() {
        const visible = visibleItems();
        if (visible.length === 0) return;
        const stops = allItems().filter((i) => i.getAttribute("tabindex") === "0");
        if (stops.length === 1 && isVisible(stops[0])) return;
        const keep =
            stops.find(isVisible) ??
            visible.find((i) => i.getAttribute("aria-selected") === "true") ??
            visible[0];
        setStop(keep);
    }

    let observer: MutationObserver | undefined;

    onMounted(() => {
        if (!treeRef.value) return;
        normalise();
        observer = new MutationObserver(normalise);
        observer.observe(treeRef.value, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ["aria-expanded"],
        });
    });

    onBeforeUnmount(() => {
        observer?.disconnect();
        clearTimeout(bufferTimer);
    });

    function onfocusin(event: FocusEvent) {
        const item = (event.target as HTMLElement).closest<HTMLElement>("[role='treeitem']");
        if (item && treeRef.value?.contains(item)) setStop(item);
    }

    function focusItem(item: HTMLElement | undefined) {
        if (!item) return;
        setStop(item);
        item.focus();
    }

    function onkeydown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;
        const item = target.closest<HTMLElement>("[role='treeitem']");
        if (!item || !treeRef.value?.contains(item)) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        const visible = visibleItems();
        const index = visible.indexOf(item);
        const expanded = item.getAttribute("aria-expanded");

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                focusItem(visible[Math.min(index + 1, visible.length - 1)]);
                return;
            case "ArrowUp":
                event.preventDefault();
                focusItem(visible[Math.max(index - 1, 0)]);
                return;
            case "Home":
                event.preventDefault();
                focusItem(visible[0]);
                return;
            case "End":
                event.preventDefault();
                focusItem(visible[visible.length - 1]);
                return;
            case "ArrowRight":
                if (target !== item) return;
                event.preventDefault();
                if (expanded === "false") {
                    item.setAttribute("aria-expanded", "true");
                } else if (expanded === "true") {
                    focusItem(item.querySelector<HTMLElement>("[role='group'] [role='treeitem']") ?? undefined);
                }
                return;
            case "ArrowLeft":
                if (target !== item) return;
                event.preventDefault();
                if (expanded === "true") {
                    item.setAttribute("aria-expanded", "false");
                } else {
                    focusItem(parentItem(item) ?? undefined);
                }
                return;
            case "Enter":
            case " ":
                if (target !== item) return;
                event.preventDefault();
                item.click();
                return;
            case "*":
                event.preventDefault();
                for (const sibling of Array.from(item.parentElement?.children ?? [])) {
                    if (sibling.getAttribute("role") === "treeitem" && sibling.getAttribute("aria-expanded") === "false") {
                        sibling.setAttribute("aria-expanded", "true");
                    }
                }
                return;
        }

        // Typeahead
        if (event.key.length === 1) {
            event.preventDefault();
            buffer += event.key.toLowerCase();
            clearTimeout(bufferTimer);
            bufferTimer = setTimeout(() => (buffer = ""), 500);
            const cycle = buffer.length === 1 || [...buffer].every((c) => c === buffer[0]);
            const needle = cycle ? buffer[0] : buffer;
            const ordered = [...visible.slice(index + (cycle ? 1 : 0)), ...visible.slice(0, index + (cycle ? 1 : 0))];
            focusItem(ordered.find((i) => ownText(i).startsWith(needle)));
        }
    }

</script>

<template>
    <!-- FileTree.vue -->
    <ul
        class="file-tree"
        role="tree"
        :aria-label="label"
        ref="treeRef"
        @keydown="onkeydown"
        @focusin="onfocusin"
    >
        <slot />
    </ul>
</template>
