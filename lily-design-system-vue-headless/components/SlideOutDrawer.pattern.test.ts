import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./SlideOutDrawer.vue";

test("meets the dialog contract", async () => {
    const { container, rerender } = render(Subject, { props: { label: "Settings" } });
    await runPattern("dialog", {
        root: container as HTMLElement,
        hook: "slide-out-drawer",
        open: async () => {
            await rerender({ open: false });
            await rerender({ open: true });
        },
    });
});
