// Details.razor.js — reports a <details> element's open state to .NET. `open` is what C# rendered: a reader may have
// toggled the prerendered element before this module loaded.

export function attach(node, dotnet, open) {
    const report = () => dotnet.invokeMethodAsync("OnDetailsToggle", node.open);
    node.addEventListener("toggle", report);
    if (node.open !== open) report();

    // A printed page cannot open a closed disclosure: open it for print and close it again, unless the reader had it open
    // (P42-T9). The toggle event above reports both changes, so the bound Open follows.
    let reopened = false;
    const before = () => {
        if (node.dataset.printOpen === "false" || node.open) return;
        node.open = true;
        reopened = true;
    };
    const after = () => {
        if (reopened) node.open = false;
        reopened = false;
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);

    return {
        dispose() {
            node.removeEventListener("toggle", report);
            window.removeEventListener("beforeprint", before);
            window.removeEventListener("afterprint", after);
            after();
        },
    };
}
