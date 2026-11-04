import { act, render } from "@testing-library/react";
import { useState } from "react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./MentionsInput";

test("meets the mentions contract", async () => {
    function Harness() {
        const [value, setValue] = useState("");
        const props = {
            label: "Choose",
            value,
            onChange: (e: { target: { value: string } }) => setValue(e.target.value),
            onInput: (e: { target: { value: string } }) => setValue(e.target.value),
        } as never;
        return <Subject {...(props as object)}>{null}</Subject>;
    }
    const { container } = render(<Harness />);
    await runPattern("mentions", {
        root: container.querySelector<HTMLElement>(".mentions-input")!,
        hook: "mentions-input",
        act: (run) => act(run),
    });
});
