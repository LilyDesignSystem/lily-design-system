import * as React from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import LinkPicker from "./LinkPicker";

afterEach(cleanup);

test("meets the picker-disclosure contract", async () => {
    const { container } = render(
        <LinkPicker
            label="Picker"
            links={[{ label: "Home", href: "/" }]}
        />,
    );
    await runPattern("picker-disclosure", {
        root: container.querySelector<HTMLElement>(".link-picker")!,
        hook: "link-picker",
        settle: () => act(async () => {}),
        press: async (target, key) => {
            fireEvent.keyDown(target, { key });
            await act(async () => {});
        },
        click: async (target) => {
            fireEvent.click(target);
            await act(async () => {});
        },
    });
});
