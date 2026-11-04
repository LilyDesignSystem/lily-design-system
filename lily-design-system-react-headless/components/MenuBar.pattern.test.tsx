import { render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./MenuBar";

test("meets the menubar contract", async () => {
    const { container } = render(<Subject label="Sections">{null}</Subject>);
    await runPattern("menubar", {
        root: container.querySelector<HTMLElement>(".menu-bar")!,
        hook: "menu-bar",
    });
});

test("meets the menubar-submenu contract", async () => {
    const { container } = render(<Subject label="Sections">{null}</Subject>);
    await runPattern("menubar-submenu", {
        root: container.querySelector<HTMLElement>(".menu-bar")!,
        hook: "menu-bar",
    });
});
