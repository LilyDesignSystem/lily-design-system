// @vitest-environment jsdom
// The shared autosuggest contract against the macro's markup and autosuggest.js.
import { test } from "vitest";

import { autosuggestFixture, runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { initAutosuggest } from "./autosuggest.js";

test("meets the autosuggest contract", async () => {
    document.body.innerHTML = render("autosuggest", {
        id: "fruit",
        label: "Fruit",
        ...autosuggestFixture,
    }).document.body.innerHTML;
    const root = document.querySelector(".autosuggest");
    const handle = initAutosuggest(root);
    await runPattern("autosuggest", { root, hook: "autosuggest" });
    handle.dispose();
});
