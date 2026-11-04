import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { MentionsInput } from "./mentions-input.js";

if (!customElements.get("lily-mentions-input")) customElements.define("lily-mentions-input", MentionsInput);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the mentions contract", async () => {
    document.body.innerHTML = '<lily-mentions-input label="Choose"></lily-mentions-input>';
    await runPattern("mentions", { root: document.body.firstElementChild as HTMLElement, hook: "mentions-input" });
});
