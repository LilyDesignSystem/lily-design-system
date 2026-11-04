// @vitest-environment jsdom
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { initMotionPicker } from "./motion-picker.client.js";

const env = nunjucks.configure(path.dirname(fileURLToPath(import.meta.url)), { autoescape: true });

afterEach(() => {
    document.body.innerHTML = "";
});

test("meets the picker-listbox contract", async () => {
    const opts = { label: "Picker", motions: ["full", "none", "reduced"], value: "full" };
    document.body.innerHTML = env.renderString(
        `{% from "./motion-picker.njk" import motionPicker %}{{ motionPicker(opts) }}`,
        { opts },
    );
    const root = document.body.querySelector<HTMLElement>("[data-lily-motion-picker-root]")!;
    initMotionPicker(root);
    await runPattern("picker-listbox", { root, hook: "motion-picker" });
});
