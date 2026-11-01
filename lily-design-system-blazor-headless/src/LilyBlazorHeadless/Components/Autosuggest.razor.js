// Autosuggest.razor.js -- default actions for Autosuggest.razor's keys.
// The keys' logic (open, highlight, choose, close) is C#. A C# handler cannot
// cancel only some keys, so this module (browser APIs only) cancels the default
// action of the list keys: ArrowDown / ArrowUp always (they would move the
// caret), and Home / End / Enter / Escape while the list is open (aria-expanded
// is "true"), so Enter does not submit an enclosing form and Home / End do not
// move the caret. Typing is never cancelled.

const ALWAYS = ["ArrowDown", "ArrowUp"];
const WHILE_OPEN = ["Home", "End", "Enter", "Escape"];

export function attach(input) {
    function onkeydown(event) {
        const open = input.getAttribute("aria-expanded") === "true";
        if (ALWAYS.includes(event.key) || (open && WHILE_OPEN.includes(event.key)))
            event.preventDefault();
    }
    input.addEventListener("keydown", onkeydown);
    return {
        dispose() {
            input.removeEventListener("keydown", onkeydown);
        },
    };
}
