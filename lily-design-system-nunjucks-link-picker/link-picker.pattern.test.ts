// @vitest-environment jsdom
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { initLinkPicker } from "./link-picker.client.js";

const env = nunjucks.configure(path.dirname(fileURLToPath(import.meta.url)), { autoescape: true });

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the picker-disclosure contract", async () => {
    const opts = { label: "Picker", links: [{ label: "Home", href: "/" }] };
    document.body.innerHTML = env.renderString(
        `{% from "./link-picker.njk" import linkPicker %}{{ linkPicker(opts) }}`,
        { opts },
    );
    const root = document.body.querySelector<HTMLElement>("[data-lily-link-picker-root]")!;
    initLinkPicker(root);
    await runPattern("picker-disclosure", { root, hook: "link-picker" });
});
