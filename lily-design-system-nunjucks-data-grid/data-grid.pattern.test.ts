// @vitest-environment jsdom
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "vitest";

import { gridActionsFixture, gridFixture, runPattern } from "../shared/pattern-tester";
import { autoInit } from "./data-grid.client.js";

test("meets the grid contract", async () => {
    const env = nunjucks.configure([path.dirname(fileURLToPath(import.meta.url))], {
        autoescape: true,
    });
    document.body.innerHTML = env.renderString(
        `{% from "./data-grid.njk" import dataGrid %}{{ dataGrid(label, columns, rows, labels) }}`,
        { label: "People", ...gridFixture, labels: {} },
    );
    autoInit();
    await runPattern("grid", { root: document.body, hook: "data-grid" });
});

test("meets the grid-actions contract", async () => {
    const env = nunjucks.configure([path.dirname(fileURLToPath(import.meta.url))], {
        autoescape: true,
    });
    document.body.innerHTML = env.renderString(
        `{% from "./data-grid.njk" import dataGrid %}{{ dataGrid(label, columns, rows, labels, selectionMode) }}`,
        { label: "People", ...gridActionsFixture, labels: {} },
    );
    autoInit();
    await runPattern("grid-actions", { root: document.body, hook: "data-grid" });
});
