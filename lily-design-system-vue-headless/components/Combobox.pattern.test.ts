import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Combobox.vue";

test("meets the combobox contract", async () => {
    const { container, rerender } = render(Subject, { props: { label: "Fruit" } });
    await runPattern("combobox", {
        root: container.querySelector<HTMLElement>(".combobox")!,
        hook: "combobox",
        open: () => rerender({ open: true }),
    });
});
