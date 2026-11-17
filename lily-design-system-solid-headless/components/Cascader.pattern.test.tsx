import { render } from "@solidjs/testing-library";
import type { ComponentProps } from "solid-js";
import { flush } from "solid-js";
import { createSignal } from "solid-js";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Cascader";

test("meets the tree-popup contract", async () => {
    function Harness() {
        const [value, setValue] = createSignal("");
        const props = {
            label: "Choose",
            value,
            onChange: (e: { target: { value: string } }) => setValue(e.target.value),
            onInput: (e: { target: { value: string } }) => setValue(e.target.value),
        } as unknown as ComponentProps<typeof Subject>;
        return <Subject {...props}>{null}</Subject>;
    }
    const { container } = render(() => <Harness />);
    await runPattern("tree-popup", {
        root: container.querySelector<HTMLElement>(".cascader")!,
        hook: "cascader",
        act: async (run: () => Promise<void>) => {
            await run();
            flush();
        },
    });
});
