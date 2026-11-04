import { act, render } from "@testing-library/react";
import { useState } from "react";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Combobox";

test("meets the combobox contract", async () => {
    let setOpen: (open: boolean) => void = () => {};
    function Harness() {
        const [open, set] = useState(false);
        const [value, setValue] = useState("");
        setOpen = set;
        return (
            <Subject
                label="Fruit"
                open={open}
                onOpenChange={set}
                value={value}
                onChange={setValue}
            >
                {null}
            </Subject>
        );
    }
    const { container } = render(<Harness />);
    await runPattern("combobox", {
        root: container.querySelector<HTMLElement>(".combobox")!,
        hook: "combobox",
        act: (run) => act(run),
        open: () => act(() => setOpen(true)),
    });
});
