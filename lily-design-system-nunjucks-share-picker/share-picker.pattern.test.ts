// @vitest-environment jsdom
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { initSharePicker } from "./share-picker.client.js";

const env = nunjucks.configure(path.dirname(fileURLToPath(import.meta.url)), { autoescape: true });

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the picker-disclosure contract", async () => {
    const opts = {
        label: "Picker",
        targets: [{ id: "one", label: "One", href: "https://example.test/" }],
        url: "https://example.test/",
    };
    document.body.innerHTML = env.renderString(
        `{% from "./share-picker.njk" import sharePicker %}{{ sharePicker(opts) }}`,
        { opts },
    );
    const root = document.body.querySelector<HTMLElement>("[data-lily-share-picker-root]")!;
    initSharePicker(root);
    await runPattern("picker-disclosure", { root, hook: "share-picker" });
});
