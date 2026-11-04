import { mount } from "@vue/test-utils";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import ThemePicker from "./ThemePicker.vue";

let unmount = (): void => {};
afterEach(() => unmount());

test("meets the picker-listbox contract", async () => {
    const wrapper = mount(ThemePicker, {
        attachTo: document.body,
        props: {
            label: "Picker",
            themes: ["abyss", "dark", "light"],
            value: "abyss",
            themesUrl: "/t/",
        },
    });
    unmount = () => wrapper.unmount();
    await runPattern("picker-listbox", {
        root:
            (wrapper.element.closest(".theme-picker") as HTMLElement) ??
            document.querySelector<HTMLElement>(".theme-picker")!,
        hook: "theme-picker",
    });
});
