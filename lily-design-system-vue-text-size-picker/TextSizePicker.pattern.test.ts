import { mount } from "@vue/test-utils";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import TextSizePicker from "./TextSizePicker.vue";

let unmount = (): void => {};
afterEach(() => unmount());

test("meets the picker-listbox contract", async () => {
    const wrapper = mount(TextSizePicker, {
        attachTo: document.body,
        props: { label: "Picker", sizes: ["large", "normal", "small"], value: "large" },
    });
    unmount = () => wrapper.unmount();
    await runPattern("picker-listbox", {
        root:
            (wrapper.element.closest(".text-size-picker") as HTMLElement) ??
            document.querySelector<HTMLElement>(".text-size-picker")!,
        hook: "text-size-picker",
    });
});
