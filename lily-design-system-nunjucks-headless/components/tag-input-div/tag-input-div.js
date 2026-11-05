// tag-input-div.js — the behaviour of the TagInputDiv macro.
//
// Enter with text fires `tag-input-div-add` and clears the field; with no text it stays a normal Enter, which submits
// a surrounding form; during an IME composition it confirms the composition. A remove button takes its tag out of the
// list, with the tag's hidden input, and fires `tag-input-div-remove`. The page adds the tag it is told about: only
// the page knows the words its remove button needs.

/** Wire one `.tag-input-div`. Returns a function that unwires it. */
export function initTagInputDiv(root) {
    const field = root.querySelector(".tag-input-div-field");
    if (!field) return null;
    const notify = (name, value) =>
        root.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: { value } }));
    const onKeydown = (event) => {
        if (event.key !== "Enter" || event.isComposing) return;
        const value = field.value.trim();
        if (!value) return;
        event.preventDefault();
        field.value = "";
        notify("tag-input-div-add", value);
    };
    const onClick = (event) => {
        const item = event.target.closest?.(".tag-input-div-list-item-remove")?.closest("li");
        if (!item) return;
        const value = item.querySelector(".tag-input-div-list-item-text")?.textContent ?? "";
        item.remove();
        notify("tag-input-div-remove", value);
        field.focus();
    };
    field.addEventListener("keydown", onKeydown);
    root.addEventListener("click", onClick);
    return () => {
        field.removeEventListener("keydown", onKeydown);
        root.removeEventListener("click", onClick);
    };
}

/** Wire every `.tag-input-div` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".tag-input-div")].map(initTagInputDiv).filter(Boolean);
}
