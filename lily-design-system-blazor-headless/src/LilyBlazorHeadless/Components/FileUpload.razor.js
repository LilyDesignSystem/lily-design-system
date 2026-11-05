// FileUpload.razor.js — the button opens the hidden file input. C# has no element click.

export function attach(button, input) {
    const open = () => input.click();
    button.addEventListener("click", open);
    return {
        dispose() {
            button.removeEventListener("click", open);
        },
    };
}
