// @vitest-environment jsdom
// The shared toolbar contract against the macro's markup and widget-keys.js.
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import { render } from "../../test/render.js";
import { attachToolbar } from "../widget-keys.js";

test("meets the toolbar contract", async () => {
    document.body.innerHTML = render("tool-bar", { label: "Tools" }, "").document.body.innerHTML;
    const root = document.querySelector(".tool-bar");
    const detach = attachToolbar(root);
    await runPattern("toolbar", { root, hook: "tool-bar" });
    detach();
});

test("a vertical toolbar moves on ArrowDown, with the macro's aria-orientation", async () => {
    document.body.innerHTML = render(
        "tool-bar",
        { label: "Tools", orientation: "vertical" },
        "<button>One</button><button>Two</button>",
    ).document.body.innerHTML;
    const root = document.querySelector(".tool-bar");
    const detach = attachToolbar(root);
    const [one, two] = root.querySelectorAll("button");
    one.focus();
    one.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }),
    );
    if (document.activeElement !== two)
        throw new Error("ArrowDown did not move in a vertical toolbar");
    detach();
});
