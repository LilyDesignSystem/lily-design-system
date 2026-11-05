// TagInputDiv.razor.js — Enter in the field of a TagInputDiv.
//
// C# cannot prevent a browser default per key, and Enter must add a tag rather than submit the form only when the
// field has text. Enter during an IME composition confirms the composition, so it adds nothing.

export function attach(field, dotnet) {
    const onKeydown = (event) => {
        if (event.key !== "Enter" || event.isComposing) return;
        const value = field.value.trim();
        if (!value) return;
        event.preventDefault();
        field.value = "";
        dotnet.invokeMethodAsync("OnTagAdd", value);
    };
    field.addEventListener("keydown", onKeydown);
    return {
        dispose() {
            field.removeEventListener("keydown", onKeydown);
        },
    };
}
