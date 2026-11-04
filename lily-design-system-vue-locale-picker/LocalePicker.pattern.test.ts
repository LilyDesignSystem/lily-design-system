import { mount } from "@vue/test-utils";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import LocalePicker from "./LocalePicker.vue";

let unmount = (): void => {};
afterEach(() => unmount());

test("meets the picker-listbox contract", async () => {
    const wrapper = mount(LocalePicker, {
        attachTo: document.body,
        props: { label: "Picker", locales: ["de", "fr", "it"], value: "de" },
    });
    unmount = () => wrapper.unmount();
    await runPattern("picker-listbox", {
        root:
            (wrapper.element.closest(".locale-picker") as HTMLElement) ??
            document.querySelector<HTMLElement>(".locale-picker")!,
        hook: "locale-picker",
    });
});
