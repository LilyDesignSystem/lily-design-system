// TextInputWithSearch.razor.js — Enter in the field searches, and never submits a surrounding form. Enter that confirms
// an IME composition does neither.

export function attach(field, dotnet) {
    const onKeydown = (event) => {
        if (event.key !== "Enter" || event.isComposing) return;
        event.preventDefault();
        dotnet.invokeMethodAsync("OnEnter", field.value);
    };
    field.addEventListener("keydown", onKeydown);
    return {
        dispose() {
            field.removeEventListener("keydown", onKeydown);
        },
    };
}
