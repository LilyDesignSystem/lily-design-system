// Details.razor.js — reports a <details> element's open state to .NET. `open` is what C# rendered: a reader may have
// toggled the prerendered element before this module loaded.

export function attach(node, dotnet, open) {
    const report = () => dotnet.invokeMethodAsync("OnDetailsToggle", node.open);
    node.addEventListener("toggle", report);
    if (node.open !== open) report();
    return {
        dispose() {
            node.removeEventListener("toggle", report);
        },
    };
}
