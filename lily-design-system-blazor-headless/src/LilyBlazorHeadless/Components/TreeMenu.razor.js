// TreeMenu.razor.js -- keyboard for TreeMenu.razor.
// Port of lily-design-system-svelte-headless TreeMenu.svelte. Blazor C# cannot
// read or move DOM focus synchronously, and the items are the consumer's
// ChildContent, so this module (browser APIs only, no styling) owns the keys:
// ArrowDown / ArrowUp move between the [role="treeitem"] items, wrapping at the
// ends; Home / End jump. Items are read at key time.

const KEYS = ["ArrowDown", "ArrowUp", "Home", "End"];

export function attach(tree) {
    function onkeydown(event) {
        if (!KEYS.includes(event.key)) return;
        const items = Array.from(tree.querySelectorAll("[role='treeitem']"));
        if (items.length === 0) return;
        const current = items.indexOf(event.target.closest("[role='treeitem']"));
        const last = items.length - 1;
        let next;
        if (event.key === "Home") next = 0;
        else if (event.key === "End") next = last;
        else if (event.key === "ArrowDown") next = current >= last ? 0 : current + 1;
        else next = current <= 0 ? last : current - 1;
        event.preventDefault();
        items[next].focus();
    }
    tree.addEventListener("keydown", onkeydown);
    return {
        dispose() {
            tree.removeEventListener("keydown", onkeydown);
        },
    };
}
