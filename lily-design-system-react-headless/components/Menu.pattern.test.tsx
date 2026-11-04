import { render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Menu";

test("meets the menu contract", async () => {
    const { container } = render(<Subject label="Sections">{null}</Subject>);
    await runPattern("menu", {
        root: container.querySelector<HTMLElement>(".menu")!,
        hook: "menu",
    });
});

test("meets the menu-submenu contract", async () => {
    const { container } = render(<Subject label="Sections">{null}</Subject>);
    await runPattern("menu-submenu", {
        root: container.querySelector<HTMLElement>(".menu")!,
        hook: "menu",
    });
});
