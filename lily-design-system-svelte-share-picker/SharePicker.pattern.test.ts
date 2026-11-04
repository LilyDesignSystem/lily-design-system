import { cleanup, render } from "@testing-library/svelte";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import SharePicker from "./SharePicker.svelte";

afterEach(cleanup);

test("meets the picker-disclosure contract", async () => {
    const { container } = render(SharePicker, {
        props: {
            label: "Picker",
            targets: [{ id: "one", label: "One", href: () => "https://example.test/" }],
            url: "https://example.test/",
        },
    });
    await runPattern("picker-disclosure", {
        root: container.querySelector<HTMLElement>(".share-picker")!,
        hook: "share-picker",
    });
});
