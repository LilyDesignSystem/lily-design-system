// @vitest-environment jsdom
// The shared radio-group contract against the macro's markup and widget-keys.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { attachRadioGroup } from "../widget-keys.js";

test("meets the radio-group contract", async () => {
    document.body.innerHTML = render("segment-group", { label: "Actions" }, "").document.body.innerHTML;
    const root = document.querySelector(".segment-group");
    const detach = attachRadioGroup(root);
    await runPattern("radio-group", { root, hook: "segment-group" });
    detach();
});
