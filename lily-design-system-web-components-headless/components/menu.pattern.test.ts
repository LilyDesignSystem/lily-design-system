import { afterEach, test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Menu } from "./menu.js";

if (!customElements.get("lily-menu")) customElements.define("lily-menu", Menu);

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the menu contract", async () => {
    document.body.innerHTML = '<lily-menu label="Sections"></lily-menu>';
    await runPattern("menu", {
        root: document.body.firstElementChild as HTMLElement,
        hook: "menu",
    });
});
