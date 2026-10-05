// FileTree.razor.js -- keyboard + roving tabindex for FileTree.razor.
// Faithful port of lily-design-system-svelte-headless FileTree.svelte.
// Blazor C# cannot read or move DOM focus synchronously, so this tiny module
// (browser APIs only, no styling) owns the APG tree keyboard.

export function attach(tree) {
    let buffer = "";
    let bufferTimer;

    const allItems = () => Array.from(tree.querySelectorAll("[role='treeitem']"));
    const parentItem = (item) => item.parentElement?.closest("[role='treeitem']") ?? null;

    function isVisible(item) {
        let p = parentItem(item);
        while (p) {
            if (p.getAttribute("aria-expanded") === "false") return false;
            p = parentItem(p);
        }
        return true;
    }

    const visibleItems = () => allItems().filter(isVisible);

    function ownText(item) {
        let text = "";
        item.childNodes.forEach((n) => {
            if (n.nodeType === 1 && n.getAttribute("role") === "group") return;
            text += n.textContent ?? "";
        });
        return text.trim().toLowerCase();
    }

    function setStop(target) {
        for (const item of allItems()) {
            item.setAttribute("tabindex", item === target ? "0" : "-1");
        }
    }

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

    function focusItem(item) {
        if (!item) return;
        setStop(item);
        item.focus();
    }

    function onfocusin(event) {
        const item = event.target.closest("[role='treeitem']");
        if (item && tree.contains(item)) setStop(item);
    }

    function onkeydown(event) {
        const target = event.target;
        const item = target.closest("[role='treeitem']");
        if (!item || !tree.contains(item)) return;
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
                if (expanded === "false") item.setAttribute("aria-expanded", "true");
                else if (expanded === "true") focusItem(item.querySelector("[role='group'] [role='treeitem']"));
                return;
            case "ArrowLeft":
                if (target !== item) return;
                event.preventDefault();
                if (expanded === "true") item.setAttribute("aria-expanded", "false");
                else focusItem(parentItem(item));
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

        if (event.key.length === 1) {
            event.preventDefault();
            buffer += event.key.toLowerCase();
            clearTimeout(bufferTimer);
            bufferTimer = setTimeout(() => (buffer = ""), 500);
            const cycle = buffer.length === 1 || [...buffer].every((c) => c === buffer[0]);
            const needle = cycle ? buffer[0] : buffer;
            const cut = index + (cycle ? 1 : 0);
            const ordered = [...visible.slice(cut), ...visible.slice(0, cut)];
            focusItem(ordered.find((i) => ownText(i).startsWith(needle)));
        }
    }

    normalise();
    const observer = new MutationObserver(normalise);
    observer.observe(tree, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["aria-expanded"],
    });
    tree.addEventListener("keydown", onkeydown);
    tree.addEventListener("focusin", onfocusin);

    return {
        normalise,
        dispose() {
            observer.disconnect();
            clearTimeout(bufferTimer);
            tree.removeEventListener("keydown", onkeydown);
            tree.removeEventListener("focusin", onfocusin);
        },
    };
}
