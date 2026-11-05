import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { SegmentGroup } from "./segment-group.js";

if (!customElements.get("lily-segment-group"))
    customElements.define("lily-segment-group", SegmentGroup);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the radio-group contract", async () => {
    document.body.innerHTML = '<lily-segment-group label="Actions"></lily-segment-group>';
    await runPattern("radio-group", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "segment-group",
    });
});
