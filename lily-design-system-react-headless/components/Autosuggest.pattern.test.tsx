import { act, render } from "@testing-library/react";
import { test } from "vitest";

import { autosuggestFixture, runPattern } from "../../shared/pattern-tester";
import Subject from "./Autosuggest";

test("meets the autosuggest contract", async () => {
    const { container } = render(
        <Subject
            {...autosuggestFixture}
            label="Fruit"
        />,
    );
    await runPattern("autosuggest", {
        root: container.querySelector<HTMLElement>(".autosuggest")!,
        hook: "autosuggest",
        act: (run) => act(run),
    });
});
