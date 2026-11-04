// The shared autosuggest contract against the shipped snippet.
import { it } from "vitest";
import { autosuggestFixture, runPattern } from "../../shared/pattern-tester";
import { mount, snippet, tick } from "../test/mount.js";

it("meets the autosuggest contract", async () => {
    const options = autosuggestFixture.suggestions
        .map(
            (s) => `<li class="autosuggest-option" role="option" data-value="${s.value}">${s.label}</li>`,
        )
        .join("");
    await mount("autosuggest", snippet("autosuggest").replace(/<!-- On lily:input.*?-->/s, options));
    const root = document.querySelector(".autosuggest");
    root.querySelector("input").setAttribute("aria-label", "Fruit");
    root.querySelector('[role="listbox"]').setAttribute("aria-label", "Fruit");
    await runPattern("autosuggest", { root, hook: "autosuggest", settle: tick });
});
