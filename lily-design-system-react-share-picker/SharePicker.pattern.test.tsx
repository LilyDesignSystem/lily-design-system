import * as React from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import SharePicker from "./SharePicker";

afterEach(cleanup);

test("meets the picker-disclosure contract", async () => {
    const { container } = render(
        <SharePicker
            label="Picker"
            targets={[{ id: "one", label: "One", href: () => "https://example.test/" }]}
            url="https://example.test/"
        />,
    );
    await runPattern("picker-disclosure", {
        root: container.querySelector<HTMLElement>(".share-picker")!,
        hook: "share-picker",
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
