// @vitest-environment jsdom
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { initThemePicker } from "./theme-picker.client.js";

const env = nunjucks.configure(path.dirname(fileURLToPath(import.meta.url)), { autoescape: true });

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the picker-listbox contract", async () => {
    const opts = {
        label: "Picker",
        themes: ["abyss", "dark", "light"],
        value: "abyss",
        themesUrl: "/t/",
    };
    document.body.innerHTML = env.renderString(
        `{% from "./theme-picker.njk" import themePicker %}{{ themePicker(opts) }}`,
        { opts },
    );
    const root = document.body.querySelector<HTMLElement>("[data-lily-theme-picker-root]")!;
    initThemePicker(root, { themesUrl: "/t/" });
    await runPattern("picker-listbox", { root, hook: "theme-picker" });
});
