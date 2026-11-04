import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Menu.vue";

test("meets the menu contract", async () => {
    const { container } = render(Subject, { props: { label: "Sections" } });
    await runPattern("menu", {
        root: container.querySelector<HTMLElement>(".menu")!,
        hook: "menu",
    });
});

test("meets the menu-submenu contract", async () => {
    const { container } = render(Subject, { props: { label: "Sections" } });
    await runPattern("menu-submenu", {
        root: container.querySelector<HTMLElement>(".menu")!,
        hook: "menu",
    });
});
