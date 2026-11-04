import { afterEach, test } from "vitest";

import { autosuggestFixture, runPattern } from "../../shared/pattern-tester";
import { Autosuggest } from "./autosuggest.js";

if (!customElements.get("lily-autosuggest")) customElements.define("lily-autosuggest", Autosuggest);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the autosuggest contract", async () => {
    const options = autosuggestFixture.suggestions
        .map((s) => `<li role="option">${s.label}</li>`)
        .join("");
    document.body.innerHTML = `<lily-autosuggest label="Fruit">${options}</lily-autosuggest>`;
    await runPattern("autosuggest", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "autosuggest",
    });
});
