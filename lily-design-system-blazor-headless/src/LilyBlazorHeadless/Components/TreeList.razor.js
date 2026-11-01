// TreeList.razor.js -- keyboard for TreeList.razor.
// Port of lily-design-system-svelte-headless TreeList.svelte. Blazor C# cannot read or
// move DOM focus synchronously, and the items are the consumer's ChildContent,
// so this module (browser APIs only, no styling) owns the keys: ArrowDown / ArrowUp
// move focus between the visible [role="treeitem"] items (those inside a collapsed aria-expanded="false" item are skipped), wrapping at the ends; Home / End jump. Items are
// read at key time.

const SELECTOR = "[role='treeitem']";
const KEYS = ["ArrowDown", "ArrowUp", "Home", "End"];

export function attach(root) {
    function onkeydown(event) {
        if (!KEYS.includes(event.key)) return;
        const items = Array.from(root.querySelectorAll(SELECTOR)).filter(
            (el) => !el.parentElement?.closest("[role='treeitem'][aria-expanded='false']"),
        );
        if (items.length === 0) return;
        const current = items.indexOf(document.activeElement);
        const last = items.length - 1;
        let next;
        if (event.key === "Home") next = 0;
        else if (event.key === "End") next = last;
        else if (event.key === "ArrowDown") next = current >= 0 && current < last ? current + 1 : 0;
        else next = current > 0 ? current - 1 : last;
        event.preventDefault();
        items[next].focus();
    }
    root.addEventListener("keydown", onkeydown);
    return {
        dispose() {
            root.removeEventListener("keydown", onkeydown);
        },
    };
}
