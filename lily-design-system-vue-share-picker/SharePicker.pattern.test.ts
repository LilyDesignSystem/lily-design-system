import { mount } from "@vue/test-utils";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import SharePicker from "./SharePicker.vue";

let unmount = (): void => {};
afterEach(() => unmount());

test("meets the picker-disclosure contract", async () => {
    const wrapper = mount(SharePicker, {
        attachTo: document.body,
        props: {
            label: "Picker",
            targets: [{ id: "one", label: "One", href: () => "https://example.test/" }],
            url: "https://example.test/",
        },
    });
    unmount = () => wrapper.unmount();
    await runPattern("picker-disclosure", {
        root: document.querySelector<HTMLElement>(".share-picker")!,
        hook: "share-picker",
    });
});
