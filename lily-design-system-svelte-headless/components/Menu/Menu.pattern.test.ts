import { render } from "@testing-library/svelte";
import { test } from "vitest";

import { runPattern } from "../../../shared/pattern-tester";
import Subject from "./Menu.svelte";

test("meets the menu contract", async () => {
    const { container } = render(Subject, { props: { label: "Sections" } });
    await runPattern("menu", {
        root: container.querySelector<HTMLElement>(".menu")!,
        hook: "menu",
    });
});
