import { mount } from "@vue/test-utils";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import MotionPicker from "./MotionPicker.vue";

let unmount = (): void => {};
afterEach(() => unmount());

test("meets the picker-listbox contract", async () => {
    const wrapper = mount(MotionPicker, {
        attachTo: document.body,
        props: { label: "Picker", motions: ["full", "none", "reduced"], value: "full" },
    });
    unmount = () => wrapper.unmount();
    await runPattern("picker-listbox", {
        root:
            (wrapper.element.closest(".motion-picker") as HTMLElement) ??
            document.querySelector<HTMLElement>(".motion-picker")!,
        hook: "motion-picker",
    });
});
