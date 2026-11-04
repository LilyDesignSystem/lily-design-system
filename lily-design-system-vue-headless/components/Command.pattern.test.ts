import { render } from "@testing-library/vue";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import Subject from "./Command.vue";

test("meets the command contract", async () => {
    const { container } = render(Subject, { props: { label: "Actions" } });
    await runPattern("command", {
        root: container.querySelector<HTMLElement>(".command")!,
        hook: "command",
    });
});
