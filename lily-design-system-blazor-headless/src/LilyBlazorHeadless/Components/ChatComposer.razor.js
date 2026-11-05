// ChatComposer.razor.js — plain Enter sends, as in the Svelte component. Only script can decide per key whether to
// prevent the line break. Shift+Enter stays a line break, and Enter that confirms an IME composition sends nothing.
// The form's submit handler refuses an empty, busy or disabled send.

export function attach(node) {
    const onKeydown = (event) => {
        if (event.key !== "Enter") return;
        if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
        if (event.isComposing || event.keyCode === 229) return;
        event.preventDefault();
        node.requestSubmit();
    };
    const field = node.querySelector(".chat-composer-input");
    field?.addEventListener("keydown", onKeydown);
    return {
        dispose() {
            field?.removeEventListener("keydown", onKeydown);
        },
    };
}
