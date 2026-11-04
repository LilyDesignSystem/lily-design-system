import { render } from "@testing-library/react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./TabBar";

test("meets the tabs contract", async () => {
    const { container } = render(<Subject label="Sections">{null}</Subject>);
    await runPattern("tabs", {
        root: container.querySelector<HTMLElement>(".tab-bar")!,
        hook: "tab-bar",
    });
});
