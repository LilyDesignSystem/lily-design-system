import { cleanup, fireEvent, render } from "./test-utils";
import { act } from "./test-act";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import LocalePicker from "./LocalePicker";

afterEach(cleanup);

test("meets the picker-listbox contract", async () => {
    const { container } = render(() => (
        <LocalePicker
            label="Picker"
            locales={["de", "fr", "it"]}
            defaultValue="de"
        />
    ));
    await runPattern("picker-listbox", {
        root: container.querySelector<HTMLElement>(".locale-picker")!,
        hook: "locale-picker",
        settle: () => act(async () => {}),
        press: async (target, key) => {
            fireEvent.keyDown(target, { key });
            await act(async () => {});
        },
    });
});
