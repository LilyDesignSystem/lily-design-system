import { mount } from "@vue/test-utils";
import { afterEach, test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import LinkPicker from "./LinkPicker.vue";

let unmount = (): void => {};
afterEach(() => unmount());

test("meets the picker-disclosure contract", async () => {
    const wrapper = mount(LinkPicker, {
        attachTo: document.body,
        props: { label: "Picker", links: [{ label: "Home", href: "/" }] },
    });
    unmount = () => wrapper.unmount();
    await runPattern("picker-disclosure", {
        root: document.querySelector<HTMLElement>(".link-picker")!,
        hook: "link-picker",
    });
});
