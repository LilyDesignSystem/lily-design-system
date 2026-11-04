// @vitest-environment jsdom
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { initTextSizePicker } from "./text-size-picker.client.js";

const env = nunjucks.configure(path.dirname(fileURLToPath(import.meta.url)), { autoescape: true });

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the picker-listbox contract", async () => {
    const opts = { label: "Picker", sizes: ["large", "normal", "small"], value: "large" };
    document.body.innerHTML = env.renderString(
        `{% from "./text-size-picker.njk" import textSizePicker %}{{ textSizePicker(opts) }}`,
        { opts },
    );
    const root = document.body.querySelector<HTMLElement>("[data-lily-text-size-picker-root]")!;
    initTextSizePicker(root);
    await runPattern("picker-listbox", { root, hook: "text-size-picker" });
});
