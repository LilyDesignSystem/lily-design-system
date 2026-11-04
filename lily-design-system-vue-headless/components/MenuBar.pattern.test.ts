import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./MenuBar.vue";

test("meets the menubar contract", async () => {
    const { container } = render(Subject, { props: { label: "Sections" } });
    await runPattern("menubar", {
        root: container.querySelector<HTMLElement>(".menu-bar")!,
        hook: "menu-bar",
    });
});
