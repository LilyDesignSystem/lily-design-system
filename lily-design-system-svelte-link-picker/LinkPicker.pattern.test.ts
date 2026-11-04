import { cleanup, render } from "@testing-library/svelte";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import LinkPicker from "./LinkPicker.svelte";

afterEach(cleanup);

test("meets the picker-disclosure contract", async () => {
    const { container } = render(LinkPicker, {
        props: { label: "Picker", links: [{ label: "Home", href: "/" }] },
    });
    await runPattern("picker-disclosure", {
        root: container.querySelector<HTMLElement>(".link-picker")!,
        hook: "link-picker",
    });
});
