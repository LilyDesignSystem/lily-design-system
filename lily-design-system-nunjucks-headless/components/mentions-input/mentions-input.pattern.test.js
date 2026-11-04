// @vitest-environment jsdom
// The shared mentions contract against the macro's markup and widget-keys.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { attachMentions } from "../widget-keys.js";

test("meets the mentions contract", async () => {
    document.body.innerHTML = render("mentions-input", { id: "c", label: "Choose" }).document.body.innerHTML;
    const root = document.querySelector(".mentions-input");
    const detach = attachMentions(root);
    await runPattern("mentions", { root, hook: "mentions-input" });
    detach();
});
